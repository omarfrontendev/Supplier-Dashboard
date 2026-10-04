import { createFileRoute } from "@tanstack/react-router";
import { ContractBuilder } from "@/components/contracts/contract-builder";

export const Route=createFileRoute("/rate-contracts/$contractId/edit")({head:()=>({meta:[{title:"Edit supply contract · Hoteliana Supplier Portal"},{name:"description",content:"Edit supply contract operational settings."},{property:"og:title",content:"Edit supply contract · Hoteliana Supplier Portal"},{property:"og:description",content:"Edit supply contract rates, inventory and policies."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:EditContract});

function EditContract(){const {contractId}=Route.useParams();return <ContractBuilder mode="edit" contractId={contractId}/>;}