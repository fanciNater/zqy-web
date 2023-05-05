export interface menu {
    icon: string
    name: string
    code: string
}

export const MenuListData: Array<menu> = [
    // {
    //     code: 'home',
    //     name: '首页',
    //     icon: 'HomeFilled',
    // },
    {
        code: 'computer-group',
        name: '计算集群',
        icon: 'UploadFilled',
    },
    {
        code: 'datasource',
        name: '数据源',
        icon: 'DataLine',
    },
    {
        code: 'workflow',
        name: '作业流',
        icon: 'Cpu',
    }
]