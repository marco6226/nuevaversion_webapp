import { TreeNode } from "primeng/api";

export interface TreeNodeExpand extends TreeNode{
    id?: string
    descripcion?: string
    tipoAreaId?: string ;
    estructura?: string;
    nodoPadre: TreeNode | null | undefined;
    selected?: boolean;
}