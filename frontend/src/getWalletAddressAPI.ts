export const sendAddressToServer = async (walletAddress: string) => {
    try {
        const response = await fetch('http://localhost:4000/wallet-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress }),
        });
        console.log('Response from server:', await response.json());
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('There was an error sending the address:', error);
    }
};
