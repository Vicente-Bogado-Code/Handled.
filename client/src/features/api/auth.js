export async function registerUser(username, password, email) {
    const request = await fetch(("http://localhost:5000/register"), {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "username":username,
            "password":password,
            "email":email
            })
    });
    const response = await request.json()
    return response
}
export async function loginUser(username, password) {
    const request = await fetch("http://localhost:5000/login",{
    method:"POST",
    credentials:"include",
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify({
        "username":username,
        "password":password
        })
    });
    const response = await request.json()
    return response
}