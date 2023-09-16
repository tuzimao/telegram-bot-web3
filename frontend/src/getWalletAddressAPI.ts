export const sendAddressToServer = async (walletAddress: string) => {
    try {
        const response = await fetch('http://localhost:4000/wallet-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress }),
        });

        if (!response.ok) {
            throw new Error('Server response was not ok.');
        }

        const data = await response.json(); // Ensure this is called only once
        console.log('Response from server:', data);
    } catch (error) {
        console.error('There was an error sending the address:', error);
    }
};
