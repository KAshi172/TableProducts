
    let currentPage = 1;
    const productsPerPage = 10;
    let allProducts = [];

    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        allProducts = data.slice(0, 100);

        displayProductTable(allProducts);
        displayPagination(allProducts.length);
      })
      .catch(error => console.error('Erro ao buscar os produtos:', error));

    function displayProductTable(products) {
      const tableBody = document.getElementById('product-table-body');
      tableBody.innerHTML = '';

      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const currentPageProducts = products.slice(startIndex, endIndex);

      currentPageProducts.forEach(product => {
        const row = `
          <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="img" style="height:50px;"></td>
            <td>${product.title}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    }

    function displayPagination(totalProducts) {
      const paginationContainer = document.getElementById('pagination-container');
      const totalPages = Math.ceil(totalProducts / productsPerPage);
      
      let paginationHTML = `<nav><ul class="pagination">`;
      
      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
          </li>
        `;
      }
      
      paginationHTML += `</ul></nav>`;
      paginationContainer.innerHTML = paginationHTML;
    }
    function changePage(page) {
      currentPage = page;
      displayProductTable(allProducts);
      displayPagination(allProducts.length);
    }

    function generatePDF() {
      const { jsPDF } = window.jspdf;
      html2canvas(document.querySelector(".table-responsive")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("produtos-fakestore.pdf");
      });
    }

