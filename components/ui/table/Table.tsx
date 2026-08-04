import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

function Table({
  className = "",
  children,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table
        {...props}
        className={`w-full text-left text-white ${className}`}
      >
        {children}
      </table>
    </div>
  );
}

function TableHead({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      {...props}
      className={`bg-slate-900 ${className}`}
    >
      {children}
    </thead>
  );
}

function TableBody({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      {...props}
      className={className}
    >
      {children}
    </tbody>
  );
}

function TableRow({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={`border-b border-slate-800 last:border-0 ${className}`}
    >
      {children}
    </tr>
  );
}

function TableHeader({
  className = "",
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`p-4 text-sm font-semibold text-slate-300 ${className}`}
    >
      {children}
    </th>
  );
}

function TableCell({
  className = "",
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={`p-4 text-sm ${className}`}
    >
      {children}
    </td>
  );
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;

export default Table;
