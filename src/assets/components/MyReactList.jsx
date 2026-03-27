function MyListV2() {
    const MySubject = [
        {id:1001,fname:"Marnol",lname:"Tolo"},
        {id:1002,fname:"John",lname:"Doe"},
        {id:1003,fname:"Jane",lname:"Smith"},   

    ];
    return (
        <div className="card">
        <h2 className="highlight">
            My Subject
        </h2>
        <ul>
            {MySubject.map((subject) => <li key={subject.id}>{subject.fname} {subject.lname}</li>)}
        
        </ul>
        </div>
    )

}


export default MyListV2;