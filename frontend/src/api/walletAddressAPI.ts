export const sendAddressToServer = async (address: string) => {
    try {
        const response = await fetch('http://localhost:4000/wallet-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        });

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('There was an error sending the address:', error);
    }
};
