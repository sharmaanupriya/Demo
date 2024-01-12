import os
import eel
import serial
from serial.tools import list_ports
from upath import dirConf, dirPara, printCWD, comConf, uiConf, machineConf, setDebugMsgFlag, DebugMsg
from laserconf import LaserConfig
from serialcom import SerialThread
from ui import AppUI

# Initialize Eel
eel.init('web')

setDebugMsgFlag(True)

class EelUI:
   # Declare paralist as a class variable
    machineFlag = [False, False]
    app = AppUI()

    @staticmethod
    def startUI():
        printCWD()
        EelUI.app.checkDirectory(dirConf())
        EelUI.app.checkDirectory(dirPara())

        EelUI.readMachineConf()

        # Start the Eel application
        eel.start('index.html', size=(1920, 1080))
        # eel.start('index.html', size=(920, 700))            
    
    @staticmethod
    def readMachineConf():
        config_file = machineConf()
        # read parameters from config file
        EelUI.app.machine_configFlag, paralist = EelUI.app.fileRead(config_file)

        DebugMsg(f"Machine Conf : {EelUI.app.machine_configFlag}")

        if EelUI.app.machine_configFlag:
            EelUI.app.zaxis_max = paralist[0]
            EelUI.app.laser_type = paralist[1]
            EelUI.app.default_focus = paralist[2]

            eel.updateZaxisMax(EelUI.app.zaxis_max)
            eel.updateLaserType(EelUI.app.laser_type)
            eel.updateDefaultFocus(EelUI.app.default_focus)
                    
            DebugMsg(f"Machine Read {EelUI.app.zaxis_max} {EelUI.app.laser_type} {EelUI.app.default_focus}")
            DebugMsg(f"Laser Type : {EelUI.app.laser_type}")

        else:
            pass
    
    @staticmethod
    def autoComConnect():
        config_file = comConf()
        # read parameters from config file
        EelUI.app.com_configFlag, paralist = EelUI.app.fileRead(config_file)
                        
        if EelUI.app.com_configFlag:
            if paralist:
                if len(paralist) == 2:
                    EelUI.app.com_port = paralist[0]
                    EelUI.app.com_baud = paralist[1]

                    com_port = EelUI.app.com_port
                    com_baud = EelUI.app.com_baud

                    DebugMsg(f"Com Port : {com_port}")
                    DebugMsg(f"Com Baud : {com_baud}")

                    EelUI.startSerialThread(com_port, com_baud)
                    
                    eel.updateCOMPort(com_port)
                    eel.updateBaudRate(com_baud)

                    EelUI.app.com_autoconFlag = True

            else:
                DebugMsg(len(paralist))

        else:
            DebugMsg("Auto Connect failed")

    @staticmethod
    def serialSendData(data):
        if EelUI.app.serial_thread and EelUI.app.serial_thread.serial_port:
            try:
                EelUI.app.serial_thread.serial_port.write(data.encode('utf-8'))
                
            except serial.SerialException as e:
                EelUI.app.com_errorFlag = True
                DebugMsg(f"Send SerialException: {e}")

    @staticmethod
    def startSerialThread(port, baudrate):
        EelUI.app.serial_thread = SerialThread(port=port, baudrate=baudrate,
                                               update_gui_callback=EelUI.updateData,
                                               update_data_callback=EelUI.executeData,
                                               update_exception_callback=EelUI.updateException)
        EelUI.app.serial_thread.daemon = True
        EelUI.app.serial_thread.start()
        DebugMsg("Serial Thread started")

        eel.changeBtnName("comConnectBtn", "Disconnect")
        eel.disableBtn("comRefreshBtn")

        EelUI.app.com_statusFlag = True

    @staticmethod
    def stopSerialThread():
        if EelUI.app.serial_thread:
            EelUI.app.serial_thread.stop()
            # serial_thread.join()

            DebugMsg("Serial Thread stoped")
            eel.changeBtnName("comConnectBtn", "Connect")
            eel.enableBtn("comRefreshBtn")

            EelUI.app.com_statusFlag = False


    @staticmethod
    def executeData(data):
        EelUI.app.home_cmd_idx, cmd_done = EelUI.app.excuteCmdSeq(data, EelUI.app.home_cmd, EelUI.app.home_cmd_idx, "$EZ10;")

        if cmd_done == True:
            cmd_done = False
            DebugMsg("Execute Cmd")
            eel.showMainPage()
            
    @eel.expose
    def updateException(args):
        EelUI.app.com_errorFlag = True
        EelUI.app.error_msg = f"{args[0]}"        
        err = str(args[1]).strip("(")
        err = err.strip(")")
        errlist = err.split(",")
        errno = str(errlist[0])
        
        EelUI.stopSerialThread()
        
        # Update the message based on the current overlay
        EelUI.app.msg = f"{EelUI.app.page_id} : {EelUI.app.error_msg}"

        # Check for the specific condition
        if errno == "2":
            EelUI.app.com_notfoundFlag = True
            msg = "Machine is disconnected. Check the Hardware."
            eel.disableBtn("comRefreshBtn")
            eel.disableLabel("comPortDropdown")
            eel.disableLabel("baudRateDropdown")
            eel.fileNotFound(EelUI.app.page_id == "comOverlay", msg)

        elif errno == "13":
            EelUI.app.com_disconFlag = True
            EelUI.updateStatus()
            EelUI.updateUI()
            msg = "COM PORT IS DISCONNECTED"
            eel.showExceptionMessage(EelUI.app.page_id, msg)

        # eel.statusWrite(EelUI.app.status_id, msg)
    
    @staticmethod
    def setLaser(laserFlag):
        laser_cmd = "$M50;" # Execute the command when function is called

        if laserFlag is not None:
            if laserFlag:
                laser_cmd = "$M30;"
            else:
                laser_cmd = "$M50;"

            EelUI.send_ack(laser_cmd)

    @staticmethod
    def setStatus(msg):
        status_id = EelUI.app.getStatusId()
        # eel.statusWrite(status_id, msg)
        
    @staticmethod
    def msgComPort():
        if EelUI.app.com_configFlag:

            if EelUI.app.com_errorFlag:
                EelUI.app.com_errorFlag = False
                EelUI.app.msg_list = []

                if EelUI.app.com_errorno == "2":
                    EelUI.app.msg_list.append(f"Com port not connected or unavailable")
                
                elif EelUI.app.com_errorno == "13":
                    EelUI.app.msg_list.append(f"Com port disconnected")

                EelUI.app.msg_list.append(EelUI.app.error_msg)

            else:
                if EelUI.app.com_autoconFlag:
                    EelUI.app.com_autoconFlag = False
                    EelUI.app.msg_list = []
                    EelUI.app.msg_list.append(f"Auto-connected done")
                    EelUI.app.msg_list.append(f"COM PORT : {EelUI.app.com_port}")
                    EelUI.app.msg_list.append(f"BAUD RATE : {EelUI.app.com_baud}")

                else:                    
                    if EelUI.app.com_statusFlag:
                        EelUI.app.msg_list = []
                        EelUI.app.msg_list.append(f"COM PORT : {EelUI.app.com_port}")
                        EelUI.app.msg_list.append(f"BAUD RATE : {EelUI.app.com_baud}")

                    else:
                        EelUI.app.msg_list = []
                        EelUI.app.msg_list.append(f"{EelUI.app.com_port} is disconnected")
                        
        else:
            EelUI.app.msg_list = []
            EelUI.app.msg_list.append(f"Auto-connect failed")
            EelUI.app.msg_list.append(f"COM Config file cannot be access")

        return EelUI.app.msg_list         
    
    @staticmethod
    @eel.expose
    def getComPorts():
        return [port.device for port in list_ports.comports()]

    @staticmethod
    @eel.expose
    def getBaudrates():
        # Add other baud rate options dynamically if needed
        baud_rate_list = ["9600", "19200", "38400", "57600", "115200"]
        return baud_rate_list
    
    @staticmethod
    @eel.expose
    def getBtnName(id, name):
        DebugMsg(f"Button id : {id}")
        DebugMsg(f"Current Button name : {name}")
    
    @staticmethod
    @eel.expose
    def printDebugMsg(message):
        DebugMsg(message)

    @staticmethod
    @eel.expose
    def pubToPy(dstr):        
        DebugMsg(dstr)
        EelUI.app.msg_from_web = dstr
        EelUI.updateUI()

    @staticmethod
    @eel.expose
    def initCOMDone():
        DebugMsg("Com setting init done")
        EelUI.autoComConnect()
        eel.changeBtnName("comConnectBtn", "Disconnect")
        eel.disableBtn("comRefreshBtn")
        # EelUI.updateStatus()

    @staticmethod
    @eel.expose
    def send_ack(ack_data):
        sendFlag, msg = EelUI.app.serial_thread.serialSendData(ack_data)
        # EelUI.serialSendData(ack_data)
    
    @staticmethod
    @eel.expose
    def updateData(data):
        eel.update_data(data)
    
    @staticmethod
    @eel.expose
    def connectDisconnect(selected_com_port, selected_baud_rate, btnName):
        # global serial_thread, serial_stop

        DebugMsg(f"Button : {btnName}")

        if btnName == "Connect":
            paralist = [selected_com_port, selected_baud_rate]
            
            EelUI.app.com_port = selected_com_port
            EelUI.app.com_baud = selected_baud_rate

            EelUI.startSerialThread(selected_com_port, selected_baud_rate)

            # write com parameters to config file            
            config_file = comConf()
            status = EelUI.app.fileWrite(config_file, paralist)

        elif btnName == "Disconnect":
            EelUI.stopSerialThread()

        EelUI.updateStatus()
        EelUI.updateUI()

    @staticmethod
    @eel.expose
    def updateParameter(value, id):        
        # Your logic to handle the updated parameter value
    
        config_file = machineConf()
        # read parameters from config file
        status, paralist = EelUI.app.fileRead(config_file)
        
        if status:
            if paralist:
                if len(paralist) == 3:
                    EelUI.app.zaxis_max = paralist[0]
                    EelUI.app.laser_type = paralist[1]
                    EelUI.app.default_focus = paralist[2]
                
            else:
                EelUI.app.zaxis_max = 0
                EelUI.app.laser_type = 0
                EelUI.app.default_focus = 0                
                DebugMsg(len(paralist))
        
        if id == "zmax":
            EelUI.app.zaxis_max = value
            msg = f"ID : {id}, Zaxis max : {value}"
            DebugMsg(msg)
        
        if id == "lasertype":
            EelUI.app.laser_type = value
            msg = f"ID : {id}, Laser type : {value}"
            DebugMsg(msg)
            
        if id == "focus":
            EelUI.app.default_focus = value
            msg = f"ID : {id}, Default focus : {value}"
            DebugMsg(msg)
            
        paralist = [EelUI.app.zaxis_max, EelUI.app.laser_type, EelUI.app.default_focus]        
        # write com parameters to config file        
        DebugMsg(f"para : {config_file}")
        status = EelUI.app.fileWrite(config_file, paralist)
        DebugMsg(f"status : {status}")
        # update the status bar
        EelUI.updateStatus()
        
    @staticmethod
    @eel.expose
    def setUIOption(option):
        # get the ui option file
        uiconf_file = uiConf()
        DebugMsg(f"ui option : {option}")
        
        optionlist = [option]
        status = EelUI.app.fileWrite(uiconf_file, optionlist)
        DebugMsg(f"status : {status}")
        
    @staticmethod
    @eel.expose
    def getUIOption():
        # get the ui option file
        uiconf_file = uiConf()
        
        # read parameters from config file
        readFlag, optionlist = EelUI.app.fileRead(uiconf_file)

        DebugMsg(f"Ui Conf : {readFlag}")
        DebugMsg(f"Ui Option : {optionlist}")
        
        if readFlag:
            if optionlist:
                if "single" in optionlist:
                    DebugMsg(f"Valid Option : {optionlist[0]}")
                
                elif "dual" in optionlist:
                    DebugMsg(f"Valid Option : {optionlist[0]}")
                
                elif "triple" in optionlist:
                    DebugMsg(f"Valid Option : {optionlist[0]}")
                
                else:
                    DebugMsg("Invalid Option")
        
        else:
            DebugMsg("Option file does not exist")        
        
    @staticmethod
    @eel.expose
    def goHomePos(selected_com_port, selected_baud_rate):
        EelUI.send_ack('$G28;')

    @eel.expose
    def startMachine(seconds):
        start_Countdown = "$M30;"
        EelUI.send_ack(start_Countdown)
        msg = "In process"
        eel.statusWrite("status_timer", msg)
        

    @eel.expose
    def sendAcknowledgment():
        reset_command = "$M50;"
        EelUI.send_ack(reset_command)
        msg = " "
        eel.statusWrite("status_timer", msg)
        
    @eel.expose
    def timerRestart():
        restart_machine = "$M50;"
        EelUI.send_ack(restart_machine)

    @eel.expose
    def showPopup():
        job_done = "$M50;"; # Execute the command when the popup shows up
        EelUI.send_ack(job_done)
        msg = "Process Completed"
        eel.statusWrite("status_timer", msg)
        
        
    @eel.expose
    def pauseCountdown():
        pause_Countdown = "$M50;"; # Execute the command when the popup shows up
        EelUI.send_ack(pause_Countdown)
        msg = "Pause"
        eel.statusWrite("status_timer", msg)

    @eel.expose
    def resumeCountdown():
        resume_Countdown = "$M30;"; # Execute the command when the popup shows up
        EelUI.send_ack(resume_Countdown)
        msg = "Resume"
        eel.statusWrite("status_timer", msg)
        
    @staticmethod
    @eel.expose
    def setFocus(inputValue):
        set_focus = f"$G1Z{inputValue}F20;"
        if EelUI.machineFlag[0]:
            EelUI.send_ack(set_focus)
            EelUI.machineFlag[0] = False
        
    @staticmethod
    @eel.expose
    def setObjectHeight(inputValue):
        set_Object_Height = f"$G1Z{inputValue}F20;"
        if EelUI.machineFlag[1]:
            EelUI.send_ack(set_Object_Height)
            EelUI.machineFlag[1] = False
        
            
    @eel.expose
    def validate_laser_spot_diameter(diameter):
        # Call the JavaScript function
        eel.js.validateInputld(diameter)

    # Define a function to call the JavaScript function for validating Laser Current
    @eel.expose
    def validate_laser_current(current):
        # Call the JavaScript function
        eel.js.validateInputlc(current)

    @staticmethod
    @eel.expose
    def getLaserType():
        DebugMsg(f"laser type : {EelUI.app.laser_type}")
        return EelUI.app.laser_type

    @staticmethod
    @eel.expose
    def printParameters(diameter, current, lasertype_val,):
        # Use the class variable
        DebugMsg(f"Laser Spot Diameter : {diameter}")
        DebugMsg(f"Laser Current : {current}")
        DebugMsg(f"Laser Type : {EelUI.app.laser_type}")
        DebugMsg(f"Laser Type List : {EelUI.app.laser_type_list}")
        
        laserConf = LaserConfig(EelUI.app.laser_type_list)
        laserConf.SetLaserType(str(EelUI.app.laser_type))
        # pstatus, power = laserConf.GetPower(current)
        dstatus, density = laserConf.GetDensity(current, diameter)
        
        DebugMsg(f"Current : {current}")
        
        # DebugMsg(f"{pstatus}, {power}")
        DebugMsg(f"{dstatus}, {density}")
        
        # Update the density value in the UI
        if dstatus == "valid":
            eel.updateDensity(float(density))            
        else:
            eel.updateDensity(None)
        
        # msg = f"Laser Density : {dstatus}"
        msg = f"Laser Type : {EelUI.app.laser_type}{os.linesep}Laser Density : {dstatus}"
        eel.statusWrite("status_para", msg)

    @staticmethod
    @eel.expose
    def configLaser(signal):
        if signal == "ON":
            EelUI.setLaser(True)
            eel.changeBtnName("focusLaserBtn", "Laser OFF")
        
        else:
            EelUI.setLaser(False)
            eel.changeBtnName("focusLaserBtn", "Laser ON")           

    @staticmethod
    @eel.expose
    def setPageId(page_id):
        EelUI.app.page_id = page_id
        EelUI.app.setStatusId(EelUI.app.page_id)
        EelUI.app.status_id = EelUI.app.getStatusId()
        DebugMsg(f"UI Page ID : {EelUI.app.page_id}")
        DebugMsg(f"UI Status ID : {EelUI.app.status_id}")
        EelUI.updateStatus()
        EelUI.updateUI()

    @staticmethod
    def updateStatus():
        nostatusFlag = False
        # function to write to the status bar when the respective page is visible
        if EelUI.app.page_id == "mainOverlay":
            msg_list = []
            msg_list = EelUI.msgComPort()
            
            EelUI.app.msg = "\n".join(msg_list)

        elif EelUI.app.page_id == "settingOverlay":
            msg_list = []
            msg_list = EelUI.msgComPort()
            msg_list.append(f"Z Axis max : {EelUI.app.zaxis_max}")
            msg_list.append(f"Laser type : {EelUI.app.laser_type}")
            msg_list.append(f"Default focus : {EelUI.app.default_focus}")
            
            EelUI.app.msg = "\n".join(msg_list)

        elif EelUI.app.page_id == "comOverlay":
            msg_list = []
            msg_list = EelUI.msgComPort()                        

            EelUI.app.msg = "\n".join(msg_list)

        elif EelUI.app.page_id == "machineOverlay":
            msg_list = []
            msg_list.append(f"Z Axis max : {EelUI.app.zaxis_max}")
            msg_list.append(f"Laser type : {EelUI.app.laser_type}")
            msg_list.append(f"Default focus : {EelUI.app.default_focus}")
            
            EelUI.app.msg = "\n".join(msg_list)                
            
        elif EelUI.app.page_id == "terminalOverlay":
            EelUI.app.msg = "Terminal for manual testing"

        elif EelUI.app.page_id == "homeOverlay":
            EelUI.app.msg = "Axis at Home position"
                    
        elif EelUI.app.page_id == "focusOverlay":
            EelUI.app.msg = "Kindly set the focus first"

        elif EelUI.app.page_id == "paraOverlay":            
            EelUI.app.msg = "Kindly set laser Current manually"

        elif EelUI.app.page_id == "exposureOverlay":
            EelUI.app.msg = "Kindly set a valid and non-zero Laser exposure time"

        elif EelUI.app.page_id == "timerOverlay":
            EelUI.app.msg = "Kindly use the above buttons to operate Laser exposure"
            
        else:
            nostatusFlag = True

        if not nostatusFlag:
            eel.statusWrite(EelUI.app.status_id, EelUI.app.msg)

    @staticmethod
    def updateUI():
        # function to update the respective page when visible
        if EelUI.app.page_id == "welcomeOverlay":
            EelUI.getUIOption()
        
        elif EelUI.app.page_id == "mainOverlay":
            pass

        elif EelUI.app.page_id == "settingOverlay":
            pass

        elif EelUI.app.page_id == "comOverlay":            
            if EelUI.app.com_statusFlag:
                eel.changeBtnName("comConnectBtn", "Disconnect")
                eel.disableBtn("comRefreshBtn")
                eel.disableLabel("comPortDropdown")
                eel.disableLabel("baudRateDropdown")

            else:
                eel.changeBtnName("comConnectBtn", "Connect")
                eel.enableBtn("comRefreshBtn")
                eel.enableLabel("comPortDropdown")
                eel.enableLabel("baudRateDropdown")

            if EelUI.app.msg_from_web == "ComRefresh":
                if EelUI.app.com_errorno == "2":
                    EelUI.app.com_errorno = "0"
                    DebugMsg("Refresh after error no 2")
                    eel.enableBtn("comConnectBtn")
                    eel.enableBtn("comRefreshBtn")
                    eel.enableLabel("comPortDropdown")
                    eel.enableLabel("baudRateDropdown")

        elif EelUI.app.page_id == "machineOverlay":
            pass               
            
        elif EelUI.app.page_id == "terminalOverlay":
            pass

        elif EelUI.app.page_id == "homeOverlay":
            EelUI.machineFlag[0] = True
                    
        elif EelUI.app.page_id == "focusOverlay":
            EelUI.machineFlag[1] = True
            EelUI.setLaser(False)
            eel.changeBtnName("focusLaserBtn", "Laser ON")

        elif EelUI.app.page_id == "paraOverlay":
            EelUI.setLaser(False)
            eel.changeBtnName("focusLaserBtn", "Laser ON")

        elif EelUI.app.page_id == "exposureOverlay":
            pass

        elif EelUI.app.page_id == "timerOverlay":
            if EelUI.app.com_disconFlag:
                EelUI.app.com_disconFlag = False
                eel.resetTimer()
            pass
        

if __name__ == "__main__": 
    EelUI.startUI()