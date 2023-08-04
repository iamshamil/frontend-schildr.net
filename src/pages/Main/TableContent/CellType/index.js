import SimpleString from "./SimpleString";
import LongText from "./LongText";
import Attached from "./Attached";
import SelectCell from "./SelectCell";
import MultiSelectCell from "./MultiSelectCell";
import DateCell from "./DateCell";
import LinkField from "./LinkField";
import CheckBoxCell from "./CheckBoxCell";
import LogDate from "./LogDate";
import LogUser from "./LogUser";

const CellType = (props) => {
    const { data, type, status, focus, width, height, position, group } = props;
    return (
        <>
            {
                (() => {
                    switch (type) {
                        case 'text':
                        case 'email':
                            return <SimpleString group={group} data={data} status={status} position={position} />
                        case 'link':
                            return <LinkField group={group} data={data} status={status} position={position} />
                        case 'longText':
                            return <LongText group={group} data={data} status={status} height={height} position={position} />
                        case 'attached':
                            return <Attached group={group} data={data} focus={focus} position={position} />
                        case 'date':
                            return <DateCell group={group} data={data} position={position} />
                        case 'select':
                            return <SelectCell group={group} data={data} width={width} position={position} />
                        case 'multiSelect':
                            return <MultiSelectCell group={group} data={data} width={width} position={position} />
                        case 'checkBox':
                            return <CheckBoxCell group={group} data={data} width={width} position={position} />
                        case 'createdAt':
                        case 'updatedAt':
                            return <LogDate group={group} data={data} width={width} position={position} />
                        case 'createdBy':
                        case 'updatedBy':
                            return <LogUser group={group} data={data} width={width} position={position} />
                        default:
                            return <SimpleString group={group} data={data} status={status} position={position} />
                    }
                })()
            }
        </>
    )
}

export default CellType;