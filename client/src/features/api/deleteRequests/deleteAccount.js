export async function deleteMyAccount() {
    const request = await fetch("http://localhost:5000/deleteMyAccount",{
        method:"POST",
        credentials:"include",
    });
}