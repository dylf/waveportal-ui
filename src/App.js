import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json'
import Form from './Form';

export default function App() {
  // Contract Info
  const contractAddress = '0x191652C7b098b179e85a0569d7026307B8170fCd';
  const contractABI = abi.abi;

  // State variables
  const [currentAccount, setCurrentAccount] = React.useState('');
  const [totalWaves, setTotalWaves] = React.useState(0);
  const [wavingInProgress, setWavingInProgress] = React.useState(false);
  const [allWaves, setAllWaves] = React.useState([]);
  const [waveMessage, setWaveMessage] = React.useState('');

  // Retrieve all the waves in the contract
  const getAllWaves = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.getAllWaves();

    let wavesCleaned = [];
    waves.forEach(wave => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      });
    });

    setAllWaves(wavesCleaned);
  }

  // Determine if metamask is connected.
  const checkIfWalletIsConnected = () => {
    
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    }

    console.log("We have the ethereum object", ethereum);

    ethereum.request({ method: 'eth_accounts'})
    .then(accounts => {
      if (accounts.length === 0) {
        console.log('No authorized account found');
        return;
      }
      const account = accounts[0];
      console.log('Found an authorized account: ', account);

      setCurrentAccount(account);
      getTotalWaves();
      getAllWaves();
    })
  };

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please set up metamask!");
    }

    ethereum.request({method: 'eth_requestAccounts'})
      .then(accounts => {
        console.log('Connected', accounts[0]);
        setCurrentAccount(accounts[0]);
      })
      .catch(err => console.error(err));
  }

  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  const getTotalWaves = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);
    let count = await waveportalContract.getTotalWaves();
    setTotalWaves(count.toNumber());
  }

  const wave = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves();
    console.log('Retrieved total wave count...', count);

    const waveTxn = await waveportalContract.wave(waveMessage, { gasLimit: 300000 });
    setWavingInProgress(true);
    console.log('Mining,,,', waveTxn.hash);
    await waveTxn.wait();
    console.log('Mined -- ', waveTxn.hash);
    setWavingInProgress(false);

    count = await waveportalContract.getTotalWaves();
    console.log('Total waves', count);
    setTotalWaves(count.toNumber());
    getAllWaves();
  };
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hello there!
        </div>

        <div className="bio">
        I am Dylan and I work on web3 stuff so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        {currentAccount &&
          // <form>
          //   <label><input type="text" placeholder="Type your message here" /></label>
          //   <button className="button waveButton" onClick={wave}>
          //   Wave at Me
          //   </button>
          // </form>
          <Form submitHandler={wave} changeHandler={setWaveMessage} defaultMessage={waveMessage} />

        }   
        {currentAccount ? null : (
          <button className="button walletButton" onClick={connectWallet}>
            Connect wallet
          </button>
        )}

        {wavingInProgress && (
          <div className="loader">
            Confirming wave: <span className="loader-outer">
              Loading...
              <span className="loader-inner"></span>
            </span>
          </div>
        )}

        <div className="totalWaves">
          Total waves: {totalWaves}
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div className="waveListing">
              <div><span>Address:</span> {wave.address}</div>
              <div><span>Time:</span> {wave.timestamp.toString()}</div>
              <div><span>Message:</span> {wave.message}</div>
            </div>
          )
        })}

      </div>
    </div>
  );
}
