document.addEventListener("DOMContentLoaded", function () {
  // Fetch token from localStorage
  const token = localStorage.getItem('token');

  // Fetch NFT data from your API with the Bearer token
  fetch('https://nftifyserver-production.up.railway.app/nfts', {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
  })
      .then(response => response.json())
      .then(data => renderNFTs(data))
      .catch(error => console.error('Error fetching NFTs:', error));

  function renderNFTs(nfts) {
      const nftContainer = document.getElementById('nftContainer');
      console.log(nfts);

      // Check if nfts is an array
      if (Array.isArray(nfts)) {
          nfts.forEach(nft => {
              // Construct full URL for the image with default extension
              const imageUrl = `https://nftifyserver-production.up.railway.app/uploads/${nft.picture}`;

              // Build HTML dynamically based on the presence of fields
              let htmlContent = `
                  <div class="col-lg-4">
                      <div class="item">
                          <img src="${imageUrl}" alt="" style="border-radius: 20px;">
                          <h4>${nft.itemTitle}</h4>
                          <div class="line-dec"></div>
              `;
              if (nft.creator) {
                  htmlContent += `<div>
                                      <span>Creator: <br> <strong>${nft.creator}</strong></span>
                                  </div>`;
              }

              if (nft.description) {
                  htmlContent += `<div>
                                      <span>Description: <br> <strong>${nft.description}</strong></span>
                                  </div>`;
              }

              if (nft.price) {
                  htmlContent += `<div class="col-6">
                                      <span>Price: <br> <strong>${nft.price} ETH</strong></span>
                                  </div>`;
              }

              htmlContent += `
                          </div>
                      </div>
                  </div>
              `;

              nftContainer.innerHTML += htmlContent;
          });
      } else {
          console.error('Error: NFT data is not an array.');
      }
  }
});
