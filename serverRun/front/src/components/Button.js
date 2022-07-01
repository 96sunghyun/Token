import { Link } from 'react-router-dom';

const style = {
    buttonDefault: `flex justify-center items-center text-center px-3 py-1 border rounded-lg bg-[#755139] text-[#F2EDD7] select-none`
}

export default function Button({ name="no name", urlPath="#",
                                isSubmit = false, onSubmit, disabled = false,
                                alert, alertMsg="no msg", onlyDesign=false }) {
    
    // For submitting
    if (isSubmit) {
        return (
            <button onClick={onSubmit} className={style.buttonDefault + ` w-1/2 ${disabled ? `` : ` hover:brightness-150`}`} disabled={disabled}>
                {name}
            </button>
        )
    }

    // For alert buttons
    if (alert) {
        return (
            <button onClick={()=>window.alert(alertMsg)} className={style.buttonDefault + ` hover:brightness-150`}>
                {name}
            </button>
        )
    }

    // Just button design
    if (onlyDesign) { 
        return (
            <button onClick={onSubmit} className={style.buttonDefault + ` hover:brightness-150`}>
                {name}
            </button>
        )
    }

    // Just for links
    return (
        <Link to={`/${urlPath}`} className={style.buttonDefault + ` hover:brightness-150`}>
            {name}
        </Link>
    )
}