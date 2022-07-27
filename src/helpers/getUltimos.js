export const getUltimos = async() => {
    // const resp = await fetch('http://localhost:3009/ultimos');
    const resp = await fetch('https://glacial-tor-72395.herokuapp.com/ultimos');
    const data = await resp.json();
    return data.ultimos;
}