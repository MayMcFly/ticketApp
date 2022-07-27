export const getUsuarioStorage = () => {
    return {
        numEmpleado: localStorage.getItem('numEmpleado'),
        escritorio: localStorage.getItem('escritorio')
    }
}