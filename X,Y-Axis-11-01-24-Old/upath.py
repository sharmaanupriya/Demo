import pathlib

# function to print debug info
debugflag = [False]

# directory path
cwd = pathlib.Path.cwd()
program_dir = pathlib.Path(cwd, "pgms")
parameters_dir = pathlib.Path(cwd, "para")
config_dir = pathlib.Path(cwd, "config")

config_file = pathlib.Path(config_dir, "com_settings.conf")
uiconf_file = pathlib.Path(config_dir, "ui_option.conf")
para_file = pathlib.Path(parameters_dir, "machine.conf")

def dirPgm():
    return program_dir

def dirPara():
    return parameters_dir

def dirConf():
    return config_dir

def comConf():
    return config_file

def uiConf():
    return uiconf_file

def machineConf():
    return para_file

def printCWD():
    print(f"cwd : {cwd}")

def DebugMsg(text):
    if debugflag[0]:
        print(text)

def setDebugMsgFlag(setFlag):
    debugflag[0] = setFlag