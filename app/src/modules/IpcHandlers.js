import { ipcMain } from "electron";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "./constants";
const authUtility = require("./AuthUtility");
const databaseUtility = require("./DatabaseUtility");
const fileSystemUtility = require("./FileSystemUtility");

ipcMain.handle(IPC_HANDLERS.AUTH, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.SIGN_IN:
      return authUtility.signIn(args.data);
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.DATABASE, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.INITIAL:
      return databaseUtility.initial(args.data);
    case IPC_FUNCTIONS.GET_PROFILE:
      return databaseUtility.getProfile(args.data);
    case IPC_FUNCTIONS.GET_SCOOTER_LIST:
      return databaseUtility.getScooterList(args.data);
    case IPC_FUNCTIONS.GET_SCOOTER_BY_ID:
      return databaseUtility.getScooterById(args.data);
    case IPC_FUNCTIONS.ADD_SCOOTER:
      return databaseUtility.addScooter(args.data);
    case IPC_FUNCTIONS.UPDATE_SCOOTER:
      return databaseUtility.updateScooter(args.data);
    case IPC_FUNCTIONS.DELETE_SCOOTER:
      return databaseUtility.deleteScooter(args.data);
    case IPC_FUNCTIONS.SYNCHRONIZE:
      return databaseUtility.synchronize(args.data);
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.FILE_SYSTEM, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.UPLOAD_SIGNATURE:
      return fileSystemUtility.uploadSignature(args.data);
    case IPC_FUNCTIONS.CHECK_SERVER_STATUS:
      return fileSystemUtility.checkServerStatus(args.data);
    default:
      return null;
  }
});
