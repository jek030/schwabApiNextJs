import { DataTable } from "../ui/table";
import { ColumnDef } from "@tanstack/react-table";

export default function EmptyDataTableSkeleton(columns:ColumnDef<any>[]) {
    return <DataTable columns={columns} data={[]}/>
}