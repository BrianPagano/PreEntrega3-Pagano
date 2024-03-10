document.querySelectorAll('.botonAgregarCarrito').forEach(function(button) {
  button.addEventListener ('click', async function() {
    let pid = this.dataset.pid
    let cid = this.dataset.cid

      // gregar el producto al carrito
      agregarProductoAlCarrito(cid, pid)

  })
})

function agregarProductoAlCarrito(cid, pid) {
  fetch(`/api/carts/${cid}/products/${pid}`, {
      method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
      console.log(data)
      const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
      })

      Toast.fire({
          icon: 'success',
          title: `Producto agregado correctamente`,
      })
  })
  .catch(error => {
      console.error('Error al cancelar la compra:', error)
  })
}