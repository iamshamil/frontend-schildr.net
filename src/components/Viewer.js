import React, { useEffect, useState } from 'react';
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';

const Viewer = (props) => {
    const { uri } = props;
    const [file, setFile] = useState('');
    const [type, setType] = useState('');

    const onError = (e) => {
        console.log(e, 'error in file-viewer');
    }

    useEffect(() => {
        if (uri) {
            setFile(uri)
            setType(uri.split('.').pop())
        }
    }, [uri])

    return (
        <FileViewer
            fileType={type}
            filePath={file}
            errorComponent={CustomErrorComponent}
            onError={onError} />
    );
}

export default Viewer;