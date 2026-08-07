
export function getDate(){
    const dateObject = new Date();
    const currentDate = `${("0" + dateObject.getDate()).slice(-2)}/${("0" + dateObject.getMonth()).slice(-2)}/${dateObject.getFullYear()}`;
    return currentDate
}