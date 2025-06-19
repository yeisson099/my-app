import React from "react";
import AdvisorDetailPageContent from "./AdvisorDetailPageContent";
import { Advisor } from "@types";
import { getAdvisorById } from "@lib";

export default async function AdvisorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const advisorId = parseInt((await params).id);
  let advisor: Advisor | null = null;

  if (isNaN(advisorId)) {
    throw new Error("Advisor not found");
  }

  try {
    const advisor = await getAdvisorById(advisorId);
    return (
        <AdvisorDetailPageContent initialAdvisorData={advisor} />
    );
  } catch (error) {
    console.error("Failed to fetch advisor:", error);
    throw new Error("Advisor not found");
  }
}
