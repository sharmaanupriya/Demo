import os
from upath import DebugMsg

class AppUI():
    def __init__(self):
        self.status_dict = { "mainOverlay" : "status_main",
                             "settingOverlay" : "status_setting",
                             "comOverlay" : "status_com",
                             "machineOverlay" : "status_machine",
                             "updateOverlay" : "status",
                             "terminalOverlay" : "status_terminal",
                             "homeOverlay" : "status_home",
                             "focusOverlay" : "status_focus",
                             "paraOverlay" : "status_para",
                             "exposureOverlay" : "status_exposure",
                             "timerOverlay" : "status_timer"                             
                            }
        
        self.serial_thread = ""
        self.com_port = ""
        self.com_baud = 0
        self.com_statusFlag = False        
        self.com_autoconFlag = False
        self.com_errorFlag = False
        self.com_notfoundFlag = False
        self.com_disconFlag = False
        self.com_errorno = 0

        self.zaxis_max = 0
        self.laser_type = ""
        self.default_focus = 0
        self.laser_type_list = ["2W", "8W"]

        self.page_id = ""
        self.status_id = ""

        self.com_configFlag = 0
        self.machine_configFlag = 0

        self.msg_list = []
        self.msg = ""
        self.error_msg = ""

        self.home_cmd = ["$G28;", "$EZ11;", "$EZ10;"]
        self.home_cmd_idx = 0

        self.msg_from_web = ""

    def checkDirectory(self, dir_name):
		# Check if directory exists
        if os.path.isdir(dir_name):
            pass						# If it exists do nothing 
        
        else:
            os.mkdir(dir_name)		# If it does not exist create the directory

    def excuteCmdSeq(self, data, cmd_seq, cmd_idx, cmd_exc):
        cmd_len = len(cmd_seq) - 1
        done = False

        if data == str(cmd_seq[cmd_idx]):
            DebugMsg(f"r : {cmd_idx}")

            cmd_idx = cmd_idx + 1
            
            if data == cmd_exc:
                done = True                        

            if cmd_idx > cmd_len:                    
                cmd_idx = 0

        else:
            cmd_idx = 0

        return cmd_idx, done

    def fileRead(self, file):
        input_file = file
        status = False
        # to check if the file exists
        if os.path.isfile(input_file):
            DebugMsg("Config file present")
            
            # read the input file
            with open(input_file, 'rt') as config:
                paralist = [line.rstrip('\n') for line in config]

                InfoMsg = f"Parameters: {paralist}"
                DebugMsg(InfoMsg)
                
                status = True
            
        else:
            status = False
            paralist = [0]
            
        return status, paralist
    
    def fileWrite(self, file, paralist):
        output_file = file
        status = False
        
        # write com parameters to config file
        with open(output_file, 'w') as config:
            for data in paralist:
                config.write(str(data) + "\n")
                
            status = True
            
        return status        
        
    def getStatusId(self):
        return self.status_id
    
    def setStatusId(self, page_id):
        self.status_id = self.status_dict.get(page_id, "invalid")