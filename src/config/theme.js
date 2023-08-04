const overrides = {
    //     MuiAvatar: {
    //         styleOverrides: {
    //             root: {
    //                 borderRadius: 6
    //             }
    //         }
    //     },
    //     MuiIconButton: {
    //         styleOverrides: {
    //             root: {
    //                 borderRadius: 6,
    //                 '&:hover': {
    //                     boxShadow: 'unset',
    //                     backgroundColor: 'transparent'
    //                 }
    //             }
    //         }
    //     },
    //     MuiMenuItem: {
    //         styleOverrides: {
    //             root: {
    //                 '&.Mui-selected': {
    //                     backgroundColor: '#4584ff'
    //                 },
    //                 '&:hover': {
    //                     backgroundColor: '#54aeff52'
    //                 }
    //             }
    //         }
    //     },
    //     MuiListItemButton: {
    //         styleOverrides: {
    //             root: {
    //                 borderRadius: 0,
    //                 '&:hover': {
    //                     backgroundColor: '#54aeff52'
    //                 }
    //             }
    //         }
    //     },
    //     MuiButtonBase: {
    //         defaultProps: {
    //             disableRipple: true
    //         },
    //         styleOverrides: {
    //             root: {
    //                 '&:hover': {
    //                     boxShadow: 'unset'
    //                 }
    //             }
    //         }
    //     },
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: "capitalize",
                boxShadow: 'unset',
                '&:hover': {
                    boxShadow: 'unset',
                },
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
            }
        }
    }
};

export const light = {
    palette: {
        mode: 'light',
        secondary: {
            light: "#ff7c35",
            main: "#ff5900",
            dark: "#b74203"
        },
        success: {
            lighter: '#D8FBDE',
            light: '#86E8AB',
            main: '#36B37E',
            dark: '#1B806A',
            darker: '#0A5554',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#fff',
            paper: "#fff"
        },
    },
    typography: {
        fontFamily: "'Helvetica Neue', sans-serif",
        fontSize: 13
    },
    shape: {
        borderRadius: 4
    },
    components: overrides
};

export const dark = {
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: "Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
        fontSize: 13
    },
    shape: {
        borderRadius: 4
    },
    components: overrides
};
