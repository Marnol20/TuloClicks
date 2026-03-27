import { useState } from "react";

function MyForm()
{
    const [message, setMesssage]= useState('');
    const [submit, setSubmit]= useState();

    const handleClick = () => {
        setSubmit(!submit)
    }
    
    return(
        <div className="card">
            <form>
                <label className="highlight">Enter your Message</label>
                <br />
                <input type="text" value={message} onChange ={(e)=> setMesssage(e.target.value)}/>
                <br />
                <button type="button"onClick={handleClick}> Show </button>
                <p>Your Message: {submit && message}</p>
            </form>
        </div>
    )

   
}

export default MyForm;