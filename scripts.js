const contractAddress = "0x2Fa0e19f8dB2BEa5Ab9c4162A7fBc363D571bd23";
const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
    ],
    name: "AppointmentCanceled",
    type: "event",
  },
  {
    inputs: [],
    name: "appointmentCompleted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
    ],
    name: "AppointmentCompleted",
    type: "event",
  },
  {
    inputs: [],
    name: "cancelAppointment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FeeWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_doctor",
        type: "address",
      },
      {
        internalType: "string",
        name: "_service",
        type: "string",
      },
    ],
    name: "makeAppointment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "NewAppointment",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_doctor",
        type: "address",
      },
    ],
    name: "registerDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
    ],
    name: "registerPatient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_service",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "setServiceFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "appointments",
    outputs: [
      {
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "service",
        type: "string",
      },
      {
        internalType: "enum Healthcare.AppointmentStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "roles",
    outputs: [
      {
        internalType: "enum Healthcare.Role",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "serviceFees",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let provider;
let signer;
let contract;

window.onload = async () => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", (accounts) => {
      location.reload();
    });
  }
};
//https://polygon-mumbai.g.alchemy.com/v2/rbIGn34I0G9e8pTv5_tfCFeuwpI5CnBF%60
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    healthcareContract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      if (accounts) {
        document.getElementById("walletStatus").textContent = "Connected";
        document.getElementById("walletStatus").className = "connected";
      } else {
        document.getElementById("walletStatus").textContent = "Disconnected";
        document.getElementById("walletStatus").className = "disconnected";
      }
    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    alert("Please install MetaMask!");
  }
}

async function makeAppointment() {
  const doctorAddress = document.getElementById("doctorAddress").value;
  const service = document.getElementById("service").value;
  const fee = await healthcareContract.serviceFees(service);
  try {
    const tx = await healthcareContract.makeAppointment(
      doctorAddress,
      service,
      {
        value: fee.toString(), // Convert to string because ethers.js expects a BigNumber or string for value
      },
    );
    await tx.wait();
    alert("Appointment successful!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function cancelAppointment() {
  try {
    const tx = await healthcareContract.cancelAppointment();
    await tx.wait();
    alert("Appointment cancellation successful!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function appointmentCompleted() {
  try {
    const tx = await healthcareContract.appointmentCompleted();
    await tx.wait();
    alert("Appointment Completed!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function withdraw() {
  try {
    const tx = await healthcareContract.withdraw();
    await tx.wait();
    alert("Withdraw successful!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function registerDoctorBtn() {
  const doctorAddress = document.getElementById("doctorAddress").value;
  console.log(doctorAddress);
  try {
    const tx = await healthcareContract.registerDoctor(doctorAddress);
    await tx.wait();
    alert("Doctor Registration successful!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function registerPatientBtn() {
  const patientAddress = document.getElementById("patientAddress").value;
  console.log(patientAddress);
  try {
    const tx = await healthcareContract.registerPatient(patientAddress);
    await tx.wait();
    alert("Patient Registration successful!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function setServiceFeeBtn() {
  const serviceName = document.getElementById("serviceName").value;
  const serviceFee = ethers.utils.parseEther(
    document.getElementById("serviceFee").value,
  );
  try {
    const tx = await healthcareContract.setServiceFee(serviceName, serviceFee);
    await tx.wait();
    alert("Service fee set successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}
