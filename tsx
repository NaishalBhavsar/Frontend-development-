import { Box, Paper } from "@mui/material";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import { format } from "date-fns";
import type { Project } from "../../types/project";
import { TableHeader, tableColumns } from "./TableHeader";
import type { SortDir, SortKey } from "../../utils/filterSort";
import { useEffect, useMemo, useRef } from "react";

type Props = {
  rows: Project[];
  selectedId: string | null;
  onSelect: (p: Project) => void;

  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (k: SortKey) => void;

  // for marker->row sync scroll
  scrollToId?: string | null;
  onScrolledToId?: () => void;
};

export function ProjectTable(props: Props) {
  const listRef = useRef<List>(null);

  const idToIndex = useMemo(() => {
    const m = new Map<string, number>();
    props.rows.forEach((r, i) => m.set(r.id, i));
    return m;
  }, [props.rows]);

  useEffect(() => {
    if (!props.scrollToId) return;
    const idx = idToIndex.get(props.scrollToId);
    if (idx != null) {
      listRef.current?.scrollToItem(idx, "smart");
      props.onScrolledToId?.();
    }
  }, [props.scrollToId, idToIndex, props]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const r = props.rows[index];
    const isSelected = r.id === props.selectedId;

    return (
      <Box
        style={style}
        display="flex"
        alignItems="center"
        sx={{
          cursor: "pointer",
          bgcolor: isSelected ? "action.selected" : "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          ":hover": { bgcolor: isSelected ? "action.selected" : "action.hover" },
        }}
        onClick={() => props.onSelect(r)}
      >
        <Cell width={tableColumns[0].width}>{r.projectName}</Cell>
        <Cell width={tableColumns[1].width}>{r.latitude.toFixed(6)}</Cell>
        <Cell width={tableColumns[2].width}>{r.longitude.toFixed(6)}</Cell>
        <Cell width={tableColumns[3].width}>{r.status}</Cell>
        <Cell width={tableColumns[4].width}>{format(new Date(r.lastUpdated), "yyyy-MM-dd HH:mm")}</Cell>
      </Box>
    );
  };

  return (
    <Paper variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TableHeader sortKey={props.sortKey} sortDir={props.sortDir} onSortChange={props.onSortChange} />

      <Box sx={{ flex: 1 }}>
        <List
          ref={listRef}
          height={520}
          width={"100%"}
          itemCount={props.rows.length}
          itemSize={44}
        >
          {Row}
        </List>
      </Box>
    </Paper>
  );
}

function Cell({ width, children }: { width: number; children: React.ReactNode }) {
  return (
    <Box width={width} px={1} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      {children}
    </Box>
  );
}
