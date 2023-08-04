import { useContext } from 'react';

import { TableContext } from '../contexts/table';

// ==============================|| CONFIG - HOOKS  ||============================== //

const useTableContext = () => useContext(TableContext);

export default useTableContext;
