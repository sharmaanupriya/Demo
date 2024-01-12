import decimal
from decimal import Decimal

laser_type_2w = { 0.200 : 0.00,
                  0.400 : 0.046,
                  0.600 : 0.262,
                  0.800 : 0.473 ,
                  1.000 : 0.696,
                  1.200 : 0.915,
                  1.400 : 1.128,
                  1.600 : 1.339,
                  1.800 : 1.545,
                  2.000 : 1.754,
                  2.200 : 1.961,
                  2.400 : 2.160,
                  2.500 : 2.255 }

laser_type_8w = { 2.0 : 0.16,
                  2.2 : 0.47,
                  2.4 : 0.89,
                  2.6 : 1.31,
                  2.8 : 1.72,
                  3.0 : 2.18,
                  3.2 : 2.58,
                  3.4 : 2.96,
                  3.6 : 3.40,
                  3.8 : 3.81,
                  4.0 : 4.20,
                  4.2 : 4.64,
                  4.4 : 5.02,
                  4.6 : 5.47,
                  4.8 : 5.85,
                  5.0 : 6.25,
                  5.2 : 6.67,
                  5.4 : 7.07,
                  5.6 : 7.43,
                  5.8 : 7.86,
                  6.0 : 8.27,
                  6.1 : 8.42 }

class LaserConfig():
    def __init__(self, laser_option):
        self.laser_option_list = laser_option
        self.type2w = self.laser_option_list[0]
        self.type8w = self.laser_option_list[1]
        self.laser_2w = laser_type_2w
        self.laser_8w = laser_type_8w
        self.laser_dict = {}
        self.laser_type = ""
        self.slope_intercept_list_2w = []
        self.slope_intercept_list_8w = []

        self.slope_intercept_list_2w = self.GetSlopeIntercept(self.type2w)
        self.slope_intercept_list_8w = self.GetSlopeIntercept(self.type8w)

    def GetSlopeIntercept(self, laser_type):
        laser_xy_list = []
        slope_intercept_list = []

        if laser_type == str(self.type2w):
            self.laser_dict = self.laser_2w

        elif laser_type == str(self.type8w):
            self.laser_dict = self.laser_8w

        # Converting into list of tuple
        laser_xy_list = [(str(k), str(v)) for k, v in self.laser_dict.items()]

        for i in range(len(laser_xy_list)):
            if i > 0:
                dx = Decimal(laser_xy_list[i][0]) - Decimal(laser_xy_list[i - 1][0])
                dy = Decimal(laser_xy_list[i][1]) - Decimal(laser_xy_list[i - 1][1])
                m = Decimal(dy) / Decimal(dx)
                mx = m * Decimal(laser_xy_list[i][0])
                c = Decimal(laser_xy_list[i][1]) - Decimal(mx)

                tuple_element = (m, c)
                slope_intercept_list.append(tuple_element)

        return slope_intercept_list
    
    def SetLaserType(self, laser_type):
        self.laser_type = laser_type

        if laser_type == str(self.type2w):
            self.laser_dict = self.laser_2w

        elif laser_type == str(self.type8w):
            self.laser_dict = self.laser_8w
    
    def GetPower(self, laser_current):
        current = float(laser_current)
        # print(f"get power current : {current}")
        slope_intercept_list = []
        min_current = 0
        max_current = 0
        laser_data_len = 0  
        power = 0
        power_status = ""
        
        if self.laser_type == str(self.type2w):
            slope_intercept_list = self.slope_intercept_list_2w

        elif self.laser_type == str(self.type8w):
            slope_intercept_list = self.slope_intercept_list_8w
        
        # Converting into list of tuple
        laser_xy_list = [(str(k), str(v)) for k, v in self.laser_dict.items()]
        laser_data_len = len(laser_xy_list)

        min_current = Decimal(laser_xy_list[0][0])
        max_current = Decimal(laser_xy_list[laser_data_len - 1][0])

        result = any(i for i in self.laser_dict if i == current)

        if result:
            power = self.laser_dict[current]
            power_status = "range"
        else:
            if min_current < current < max_current:
                index = len([i[0] for i in enumerate(self.laser_dict) if current > Decimal(i[1])])
                slope = slope_intercept_list[index - 1][0]
                intercept = slope_intercept_list[index - 1][1]

                power = (Decimal(str(slope)) * Decimal(str(current))) + Decimal(str(intercept))
                power_status = "range"
            
            elif current < min_current:
                power_status = "min"
                power = 0

            elif current > max_current:
                power_status = "max"
                power = 0

        return power_status, power
    
    def GetDensity(self, current, diameter):
        decimal.getcontext().prec = 3
        radius = Decimal(str(diameter)) / Decimal(str(2))
        area = Decimal(str(3.14)) * Decimal(str(radius)) * Decimal(str(radius))
        power = 0
        power_status = ""
        density = 0
        density_status = ""

        power_status, power = self.GetPower(current)

        if area > 0:
            try:
                if power_status == "range":
                    density = Decimal(str(float(power))) / Decimal(str(area)) * Decimal(100.0)
                    density_status = "valid"

                else:
                    density = 0
                    density_status = "invalid"

            except:
                density = 0
                density_status = "error"
        else:
            density = 0
            density_status = "undefined"
        
        return density_status, density    

# laser_type_list = ["2W", "8W"]
# laserConf = LaserConfig(laser_type_list)
# laserConf.SetLaserType("8W")
# pstatus, power = laserConf.GetPower("6.09")
# print(f"{pstatus}, {power}")

# dstatus, density = laserConf.GetDensity("6.10", "10")
# print(f"{dstatus}, {density}")