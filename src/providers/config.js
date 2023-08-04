import useLocalStorage from '../hooks/useLocalStorage.js';
import { ConfigContext, initialState } from '../contexts/config';

const ConfigProvider = ({ children, user }) => {
    const [config, setConfig] = useLocalStorage('owao-us', {
        ...initialState,
    });

    const onChangeThemeMode = () => {
        setConfig((prevState) => ({
            ...prevState,
            isDark: !prevState.isDark
        }));
    };
    const setUser = (data) => {
        setConfig((prevState) => ({
            ...prevState,
            user: data
        }));
    };

    return <ConfigContext.Provider value={{ ...config, user, onChangeThemeMode, setUser }}>{children}</ConfigContext.Provider>;
};

export default ConfigProvider;
