import React from "react";
import AdvisorDetailPageContent from "./AdvisorDetailPageContent";
import { Advisor } from "@types";
import { getAdvisorById } from "@lib";

export default async function AdvisorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const advisorId = parseInt((await params).id);
  let advisor: Advisor | null = null;
  let advisorNotFound = false;

  if (isNaN(advisorId)) {
    advisorNotFound = true;
  }

  try {
    advisor = await getAdvisorById(advisorId);
  } catch (error) {
    console.error("Failed to fetch advisor:", error);
    advisorNotFound = true;
    return;    
  }

  return <AdvisorDetailPageContent initialAdvisorData={advisor} />;
}
