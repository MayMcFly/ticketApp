export const getEscritorios = async() => {
    const resp = await fetch('http://localhost:3009/escritorios');
    const data = await resp.json();
    return data.ultimos;
}