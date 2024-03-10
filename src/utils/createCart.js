//esto aun no se utiliza, verificar si puedo modulizar el codigo:

function createCartAndAssignToUser(userData) {
    fetch(`/api/carts`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        const cid = data.cid;
        // Realizar la solicitud Fetch para actualizar el usuario y asignarle el ID del carrito
        fetch(`/api/users/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: cid })
        })
        .then(response => response.json())
        .then(updatedUser => {
            console.log('Usuario actualizado con éxito:', updatedUser)
            // ahora que actualice el id, Redirigir a la página de inicio de sesión
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('Error al actualizar el usuario:', error)
        })
    })
    .catch(error => {
        console.error('Error al crear el carrito:', error)
    })
}

module.exports = {
    createCartAndAssignToUser
};