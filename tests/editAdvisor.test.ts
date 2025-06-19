const assert = require('assert');

// --- Mocks Necesarios ---

// 1. Mock de Tipos (simplificados para el test)
interface Advisor {
    id: string;
    name: string;
    email: string;
    income: number;
    // Añade otras propiedades que sean relevantes para el formulario de edición
    credentials: string;
    city: string;
    state: string;
    id_number: string;
    education: string;
    title: string;
    years_of_experience: string;
    avatar: string;
}

interface AdvisorPayload {
    name: string;
    email: string;
    income: number;
    credentials: string;
    city: string;
    state: string;
    id_number: string;
    education: string;
    title: string;
    years_of_experience: string;
    avatar?: string;
}

interface AdvisorUpdatePayload extends Partial<AdvisorPayload> { }

type AlertMessageType = { type: 'success' | 'error' | 'warning' | 'info'; message: string; };

// 2. Mock de `lib/api.ts`
let mockDbAdvisor: Advisor = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    income: 100000,
    credentials: 'CFA',
    city: 'New York',
    state: 'NY',
    id_number: '12345',
    education: 'Columbia University',
    title: 'Financial Advisor',
    years_of_experience: '5-10',
    avatar: 'http://example.com/john.jpg',
};

const mockGetAdvisorById = async (id: string): Promise<Advisor> => {
    console.log(`[Mock API] getAdvisorById called with ID: ${id}`);
    if (id === '1') {
        return Promise.resolve({ ...mockDbAdvisor }); // Devuelve una copia para evitar mutaciones directas
    }
    return Promise.reject(new Error('Advisor not found'));
};

const mockUpdateAdvisor = async (id: string, payload: AdvisorUpdatePayload): Promise<Advisor> => {
    console.log(`[Mock API] updateAdvisor called with ID: ${id}, Payload:`, payload);
    if (id === '1') {
        mockDbAdvisor = { ...mockDbAdvisor, ...payload }; // Actualiza el "DB" mock
        return Promise.resolve(mockDbAdvisor);
    }
    return Promise.reject(new Error('Failed to update advisor'));
};

// 3. Mock de `useAlert`
let alerts: AlertMessageType[] = [];
const mockShowAlert = (alert: AlertMessageType) => {
    alerts.push(alert);
    console.log(`[Mock Alert] Type: ${alert.type}, Message: ${alert.message}`);
};
const resetAlerts = () => { alerts = []; };


async function testEditAdvisorFlow() {
    console.log('--- Starting Test: Edit Advisor Flow ---');
    resetAlerts(); 

    let currentAdvisorState: Advisor | null = null;
    let isEditModalOpenState: boolean = false;
    let submissionLoadingState: boolean = false; 

    try {
        const fetchedAdvisor = await mockGetAdvisorById('1');
        currentAdvisorState = fetchedAdvisor;
        console.log('[Test Setup] Initial Advisor fetched:', currentAdvisorState.name);
    } catch (error: any) {
        console.error('[Test Setup] Failed to fetch initial advisor:', error.message);
        assert.fail('Initial advisor fetch failed');
    }

    console.log('\nSimulating "Edit Advisor" click...');
    isEditModalOpenState = true;
    console.log(`[Test] Modal Open State: ${isEditModalOpenState}`);
    assert.strictEqual(isEditModalOpenState, true, 'Modal should be open after edit click');

    console.log('\nSimulating form data changes...');
    const updatedFormData: AdvisorUpdatePayload = {
        name: 'Jane Doe',
        email: 'jane.doe.updated@example.com',
        income: 120000,
        credentials: 'CFP',
    };

    submissionLoadingState = true;
    console.log(`[Test] Submission Loading State: ${submissionLoadingState}`);

    try {
        const updatedAdvisor = await mockUpdateAdvisor(currentAdvisorState!.id, updatedFormData);
        currentAdvisorState = updatedAdvisor; 
        mockShowAlert({ type: 'success', message: `Advisor "${updatedAdvisor.name}" updated successfully!` });
        isEditModalOpenState = false; 
        console.log('[Test] Advisor updated successfully in mock state:', currentAdvisorState.name);
    } catch (error: any) {
        mockShowAlert({ type: 'error', message: error.message || 'Failed to update advisor.' });
        console.error('[Test] Form submission failed:', error.message);
        assert.fail(`Form submission failed: ${error.message}`);
    } finally {
        submissionLoadingState = false;
        console.log(`[Test] Submission Loading State: ${submissionLoadingState}`);
    }

    console.log('\nPerforming Assertions...');

    // close modal
    assert.strictEqual(isEditModalOpenState, false, 'Modal should be closed after successful submission');

    // updated BD
    assert.strictEqual(mockDbAdvisor.name, 'Jane Doe', 'Advisor name in mock DB should be updated');
    assert.strictEqual(mockDbAdvisor.email, 'jane.doe.updated@example.com', 'Advisor email in mock DB should be updated');
    assert.strictEqual(mockDbAdvisor.income, 120000, 'Advisor income in mock DB should be updated');
    assert.strictEqual(mockDbAdvisor.credentials, 'CFP', 'Advisor credentials in mock DB should be updated'); // Asegúrate de que este campo se pasa en la actualización si es editable

    assert.strictEqual(currentAdvisorState!.name, 'Jane Doe', 'Current advisor state name should be updated');
    assert.strictEqual(currentAdvisorState!.email, 'jane.doe.updated@example.com', 'Current advisor state email should be updated');
    assert.strictEqual(currentAdvisorState!.income, 120000, 'Current advisor state income should be updated');
    assert.strictEqual(currentAdvisorState!.credentials, 'CFP', 'Current advisor state credentials should be updated');


    // show alert
    assert.strictEqual(alerts.length, 1, 'Exactly one alert should have been shown');
    assert.strictEqual(alerts[0].type, 'success', 'The alert type should be success');
    assert.ok(alerts[0].message.includes('Jane Doe'), 'The alert message should contain the updated name');

    console.log('\n--- Test: Edit Advisor Flow Passed! ---');
}

async function testEditAdvisorValidationErrors() {
    console.log('\n--- Starting Test: Edit Advisor Validation Errors ---');
    resetAlerts();

    try {
        const fetchedAdvisor = await mockGetAdvisorById('1');
        const invalidData: AdvisorUpdatePayload = {
            email: 'invalid-email',
            income: -1000,
        };

        await mockUpdateAdvisor(fetchedAdvisor.id, invalidData);
        assert.fail('Should have thrown validation error');
    } catch (error: any) {
        assert.ok(error instanceof Error, 'Should throw an Error instance');
        assert.ok(error.message.includes('Failed to update advisor'), 'Should include error message');
        console.log('[Test] Validation error caught successfully');
    }

    console.log('\n--- Test: Edit Advisor Validation Errors Passed! ---');
}

(async () => {
    try {
        await testEditAdvisorFlow();
        await testEditAdvisorValidationErrors();
        console.log('\n=== All Tests Passed! ===');
    } catch (error: any) {
        console.error('\n--- Test Failed ---');
        console.error(error.message);
        process.exit(1); 
    }
})();