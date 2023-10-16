import { InjectedConnector } from '@web3-react/injected-connector'

export const injected = new InjectedConnector({
    supportedChainIds: [137, 80001],
})

// @ts-ignore
const { ethereum } = window;

export const switchRequest = (param) => {
    if (ethereum !== undefined) {
        //@ts-ignore
        return ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: param.chainIdHex }],
        });
    };
};

export const addChainRequest = (param) => {
    if (ethereum !== undefined) {
        //@ts-ignore
        return ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: param.chainId,
                    chainName: param.chainName,
                    rpcUrls: param.rpcUrls,
                    blockExplorerUrls: param.blockExplorerUrls,
                    nativeCurrency: param.nativeCurrency,
                },
            ],
        });
    }
};

export const swithNetwork = async (param) => {
    // console.log("chainId", chainId);
    // @ts-ignore
    if (window.ethereum) {
        try {
            await switchRequest(param);
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await addChainRequest(param);
                    await switchRequest(param);
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
