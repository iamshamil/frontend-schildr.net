import { useState } from 'react';
import { TableContext, initialTable } from '../contexts/table';

const ConfigProvider = ({ children, user }) => {
    let isAdmin = false;
    if (user && user.role && user.role === "Admin") isAdmin = true;
    const [config, setConfig] = useState({ ...initialTable, isAdmin });

    const changeHeader = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            header: data.map((e) => e)
        }));
    }
    const changeBody = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            body: data
        }));
    }
    const changeFilterBody = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            filterBody: data
        }));
    }

    const selectActive = (idx) => {
        setConfig((prevState) => ({
            ...prevState,
            active: idx
        }));
    }

    const selectEditable = (position) => {
        setConfig((prevState) => ({
            ...prevState,
            editable: position
        }));
    }

    const selectEditabled = (position) => {
        setConfig((prevState) => ({
            ...prevState,
            editabled: position
        }));
    }

    const initData = ({ header, body, hId, notifications, project }) => {
        setConfig((prevState) => ({
            ...prevState,
            header,
            body,
            hId,
            project,
            notifications,
        }));
    }

    const setHid = (id) => {
        setConfig((prevState) => ({
            ...prevState,
            hId: id,
        }));
    }


    const setFilterItem = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            filterItem: data
        }));
    }

    const setFilter = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            isFilter: data
        }));
    }

    const setUsers = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            users: data.map(e => e)
        }));
    }

    const setTableName = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            tableName: data
        }));
    }

    const setColumHandle = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            column: data
        }));
    }

    const setNotifications = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            notifications: data.map(e => e)
        }));
    }

    const setModalChange = (status) => {
        setConfig((prevState) => ({
            ...prevState,
            modalChange: status
        }));
    }

    const setDeleteRowList = (list) => {
        setConfig((prevState) => ({
            ...prevState,
            deleteRowList: list.map(e => e)
        }));
    }

    const setUserListModal = (e) => {
        setConfig((prevState) => ({
            ...prevState,
            userListModal: e
        }));
    }

    const setMultiSelect = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            multiSelect: data.map((e) => e)
        }));
    }


    return <TableContext.Provider value={{ ...config, setTableName, setUserListModal, setDeleteRowList, setModalChange, changeHeader, setColumHandle, setHid, changeBody, setUsers, changeFilterBody, setFilter, setFilterItem, selectActive, selectEditable, selectEditabled, setNotifications, setMultiSelect, initData }}>{children}</TableContext.Provider>;
};

export default ConfigProvider;
