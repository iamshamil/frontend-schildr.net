import { createContext } from 'react';

const initialTable = {
    project: {},
    header: [],
    body: [],
    notifications: [],
    filterBody: [],
    filterItem: [],
    users: [],
    multiSelect: [],
    deleteRowList: [],
    active: '',
    editable: '',
    editabled: '',
    hId: '',
    tableName: 'Project',
    isFilter: false,
    modalChange: false,
    userListModal: false,
    isAdmin: false,
    column: {
        target: null,
        direction: 'left',
        index: 0,
        type: 'add'
    },
};

const TableContext = createContext(initialTable);

export { TableContext, initialTable };
