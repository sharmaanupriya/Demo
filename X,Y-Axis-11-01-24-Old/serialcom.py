import threading
import time
import serial
from upath import DebugMsg

class SerialThread(threading.Thread):
    def __init__(self, port, baudrate, timeout=1, update_gui_callback=None, update_data_callback=None, update_exception_callback=None):
        super().__init__()
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.serial_port = None
        self.stop_event = threading.Event()
        self.update_gui_callback = update_gui_callback
        self.update_data_callback = update_data_callback
        self.update_exception_callback = update_exception_callback
        
    def getError(self, estr):
        error_str = repr(estr)
        open_idx = [pos for pos, char in enumerate(error_str) if char == "("]
        close_idx = [pos for pos, char in enumerate(error_str) if char == ")"]
        i = len(open_idx) - 1
        j = -len(close_idx)

        return estr, error_str[open_idx[i]: close_idx[j] + 1]            

    def run(self):
        while not self.stop_event.is_set():
            try:
                with serial.Serial(self.port, self.baudrate, timeout=self.timeout) as ser:
                    self.serial_port = ser
                    while not self.stop_event.is_set():
                        # Perform your serial communication tasks here
                        data = ser.readline().decode('utf-8').strip()
                        if data:
                            DebugMsg(f"Received: {data}")
                            if self.update_gui_callback:
                                self.update_gui_callback(data)  # Update the GUI with received data

                            if self.update_data_callback:
                                self.update_data_callback(data) # Update the data function with received data                            

                        # time.sleep(1)
            except serial.SerialException as e:
                estr, error = self.getError(e)
                err_args = (f"SerialException: {estr}", error)                
                DebugMsg(f"SerialException: {e}")                
                
                if self.update_exception_callback:
                    self.update_exception_callback(err_args)
                    
                # Handle the serial port error (e.g., log the error, notify the user)
                time.sleep(5)  # Wait for a while before attempting to reopen the port
                
    def stop(self):
        self.stop_event.set()

    def restart(self):
        self.stop_event.clear()
        
    def serialSendData(self, data):
        sendFlag = False
        msg = ""
        if self.serial_port:
            try:
                self.serial_port.write(data.encode('utf-8'))
                sendFlag = True
                msg = "send success"
                
            except serial.SerialException as e:
                DebugMsg(f"Send SerialException: {e}")
                sendFlag = False
                msg = f"{e}"
                
            return sendFlag, msg
                