export const getUltimos = async() => {
    // const resp = await fetch('http://localhost:3009/ultimos');
    const resp = await fetch('https://ticketclient.netlify.app/ultimos');
    const data = await resp.json();
    return data.ultimos;
}