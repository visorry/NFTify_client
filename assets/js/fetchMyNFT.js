document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    fetch('https://nftifyserver-production.up.railway.app/my-nfts', {
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
        
        if (Array.isArray(nfts)) {
            nfts.forEach(nft => {
                const imageUrl = `https://nftifyserver-production.up.railway.app/uploads/${nft.picture}`;

                let htmlContent = `
                    <div class="col-lg-4" id="nft-${nft._id}">
                        <div class="item">
                            <img src="${imageUrl}" alt="" style="border-radius: 20px;">
                            <h4>${nft.itemTitle}</h4>
                            <div class="line-dec"></div>
                            <div>
                                <span>Creator Image: <br> <img src="${nft.creatorImage || ''}" alt=""></span>
                            </div>
                            <div>
                                <span>Creator: <br> <strong>${nft.creator || ''}</strong></span>
                            </div>
                            <div>
                                <span>Description: <br> <strong>${nft.description || ''}</strong></span>
                            </div>
                            <div class="col-6">
                                <span>Price: <br> <strong>${nft.price || ''} ETH</strong></span>
                            </div>
                            <div class="col-6">
                                <span>Ends In: <br> <strong>${nft.endsIn || ''}</strong></span>
                            </div>
                            <div class="main-button">
                                <a class="edit-nft-button" data-nft-id="${nft._id}">Edit NFT</a>
                                <a class="delete-nft-button" data-nft-id="${nft._id}">Delete NFT</a>
                            </div>
                        </div>
                    </div>
                `;

                nftContainer.innerHTML += htmlContent;
            });

            // Add event listeners for delete links
            const deleteNFTLinks = document.querySelectorAll('.delete-nft-button');
            deleteNFTLinks.forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    const nftId = this.getAttribute('data-nft-id');
                    deleteNFT(nftId);
                });
            });

            // Add event listeners for edit buttons
            const editNFTButtons = document.querySelectorAll('.edit-nft-button');
            editNFTButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const nftId = this.getAttribute('data-nft-id');
                    openEditNFTModal(nftId);
                });
            });
        } else {
            console.error('Error: NFT data is not an array.');
        }
    }

    function deleteNFT(nftId) {
        fetch(`https://nftifyserver-production.up.railway.app/nfts/${nftId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) {
                console.log(`NFT with ID ${nftId} deleted successfully.`);
                removeNFTFromUI(nftId);
            } else {
                console.error(`Error deleting NFT with ID ${nftId}.`);
            }
        })
        .catch(error => console.error('Error deleting NFT:', error));
    }

    function removeNFTFromUI(nftId) {
        const nftElement = document.getElementById(`nft-${nftId}`);
        if (nftElement) {
            nftElement.remove();
        }
    }

    function openEditNFTModal(nftId) {
        fetch(`https://nftifyserver-production.up.railway.app/nfts/${nftId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(selectedNFT => {
            document.getElementById('itemTitle').value = selectedNFT.itemTitle || '';
            document.getElementById('description').value = selectedNFT.description || '';
            document.getElementById('price').value = selectedNFT.price || '';
            document.getElementById('royalties').value = selectedNFT.royalties || '';
            document.getElementById('picture').src = `https://nftifyserver-production.up.railway.app/uploads/${selectedNFT.picture || ''}`;

            const modal = document.getElementById('editNFTModal');
            modal.style.display = 'block';

            document.getElementById('form-submit').addEventListener('click', function () {
                submitEditNFTForm(selectedNFT);
            });

            document.getElementById('closeModalButton').addEventListener('click', function () {
                closeEditNFTModal();
            });
        })
        .catch(error => console.error('Error fetching NFT:', error));
    }

    function submitEditNFTForm(selectedNFT) {
        const updatedItemTitle = document.getElementById('itemTitle').value;
        const updatedDescription = document.getElementById('description').value;
        const updatedPrice = document.getElementById('price').value;
        const updatedRoyalties = document.getElementById('royalties').value;
        const updatedPicture = document.getElementById('picture').value;

        fetch(`https://nftifyserver-production.up.railway.app/nfts/${selectedNFT._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemTitle: updatedItemTitle,
                description: updatedDescription,
                price: updatedPrice,
                royalties: updatedRoyalties,
                picture: updatedPicture,
            }),
        })
        .then(response => response.json())
        .then(updatedNFT => {
            console.log('NFT updated successfully:', updatedNFT);
            closeEditNFTModal();
        })
        .catch(error => console.error('Error updating NFT:', error));
    }

    function closeEditNFTModal() {
        const modal = document.getElementById('editNFTModal');
        modal.style.display = 'none';
    }
});
