export async function getPreferences() {
    const request = await fetch("http://localhost:5000/getPreferences",{
        method:"GET",
        credentials:"include"
    });
    const response = await request.json()
    return response
}
export async function savePreferences(das,dtas,dimn,dirm,dbp){
    const request = await fetch("http://localhost:5000/savePreferences",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "defaultAutoSave":das,
            "defaultTimeAutoSave":dtas,
            "defaultIncludeMnote":dimn,
            "defaultIncludeReadme":dirm,
            "defaultBePublic":dbp
        })
    })
}