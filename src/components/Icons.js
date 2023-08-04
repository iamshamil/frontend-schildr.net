import { ReactComponent as FontSvg } from '../assets/img/svg/font.svg';
import { ReactComponent as LongTextSvg } from '../assets/img/svg/longText.svg';
import { ReactComponent as AttachedSvg } from '../assets/img/svg/attached.svg';
import { ReactComponent as OptionSvg } from '../assets/img/svg/option.svg';
import { ReactComponent as DateSvg } from '../assets/img/svg/date.svg';
import { ReactComponent as LinkSvg } from '../assets/img/svg/link.svg';
import { ReactComponent as MultiSelectSvg } from '../assets/img/svg/multiSelect.svg';
import { ReactComponent as CheckBoxSvg } from '../assets/img/svg/checkBox.svg';
import { ReactComponent as CreatedDate } from '../assets/img/svg/createdDate.svg';
import { ReactComponent as CreatedBy } from '../assets/img/svg/createdBy.svg';
import { ReactComponent as ButtonSvg } from '../assets/img/svg/button.svg';

const Icons = ({ type, editable }) => {
    return (
        <>
            {
                (() => {
                    switch (type) {
                        case 'text':
                            return <FontSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'link':
                            return <LinkSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'longText':
                            return <LongTextSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'email':
                            return <FontSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'attached':
                            return <AttachedSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'date':
                            return <DateSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'select':
                            return <OptionSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'multiSelect':
                            return <MultiSelectSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'checkBox':
                            return <CheckBoxSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'createdAt':
                        case 'updatedAt':
                            return <CreatedDate style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'createdBy':
                        case 'updatedBy':
                            return <CreatedBy style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        case 'button':
                            return <ButtonSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                        default:
                            return <FontSvg style={{ fontSize: 16, width: 16, height: 16, color: editable ? '#0ed114' : '#333333' }} />
                    }
                })()
            }
        </>
    )
}

export default Icons;