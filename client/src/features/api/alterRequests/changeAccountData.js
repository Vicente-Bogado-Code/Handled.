export async function changeAccountData(newName, newEmail, newDesc) {
    const request = await fetch("http://localhost:5000/changeAccData",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "newName":newName,
            "newEmail":newEmail,
            "newDesc": newDesc
        })
    });
    const response = await request.json()
    return response
}