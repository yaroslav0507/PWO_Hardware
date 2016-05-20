## Raspberry PI watering system
<img align="right" src="https://www.dropbox.com/s/yy2x7xsqu8gp6v7/PWO_Logo.jpg?dl=1" alt="JavaScript Robotics" height="180px">
    There is much talk about the Internet of Things, about possibilities to control real devices remotely across existing network infrastructure. 
I decided to dive deep in this new field of technologies. Here you can see what happened.
This project is an implementation of plant watering system based on raspberry pi computer, digital humidity and temperature sensor and servo.

## Overal view
<img src="https://www.dropbox.com/s/ifohfg3rbqbvjo7/PWO_Hardware_collage.jpg?dl=1" alt="Raspberry">

## Stack of technologies
- [Johnny FIve](http://johnny-five.io/);
- [Express JS](http://expressjs.com/);
- [Node JS](https://nodejs.org/);

## Initial Setup
First of all you need a raspberry pi (next rpi) and raspbian jessie installed on SD card. 
Raspbian is a kind of OS from the developers of rpi, you can download it for free from [official website](https://www.raspberrypi.org/downloads/raspbian/).
After you have installed raspbian, connect your rpi to external monitor via HDMI to see that system boots successfully (this step is not mandatory)

1. Connect PI to the power with micro usb port. You can use phone charger or usb of PC.
2. Connect PI to your local network with Ethernet cable.

The next step is to find out raspbery's IP address. 
there are two ways to figure out the IP

#### Easy way - using the pi with display
If you boot to the command line instead of the desktop, your IP address should be shown in the last few messages before the login prompt.

1. Connect rpi to display via hdmi.
2. Connect USB keyboard and mouse.
3. Using the terminal (boot to the command line or open a Terminal window from the desktop), simply type hostname -I which will reveal your Pi's IP address.

#### Headless way - using pi without display
It is possible to find the IP address of your Pi without connecting to a screen using one of the following methods:

#### Router devices list

In a web browser navigate to your router's IP address e.g. `http://192.168.1.1`, which is usually printed on a label on your router; 
this will take you to a control panel. Then log in using your credentials, which is usually also printed on the router or sent to you 
in the accompanying paperwork. Browse to the list of connected devices or similar (all routers are different), and you should see some
devices you recognise. Some devices are detected as PCs, tablets, phones, printers, etc. so you should recognise some and rule them out 
to figure out which is your Raspberry Pi. Also note the connection type; if your Pi is connected with a wire there should be fewer devices 
to choose from.
    
#### Address Resolution Protocol 
1. Open command line.
2. Type `arp -a` press enter
3. You should see a list of all devices in your local network. If rpi is connected it should be here.

#### NMAP command

The `nmap` command (Network Mapper) is a free and open-source tool for network discovery, available for Linux, Mac OS, and Windows.
- To install on Linux, install the `nmap` package e.g. apt-get install nmap.

- To install on Mac OS or Windows, see the [nmap.org](https://nmap.org/) download page.
- To use `nmap` to scan the devices on your network, you need to know the subnet you are connected to. 
First find your own IP address, in other words the one of the computer you're using to find your Pi's IP address:

- On Linux, type `hostname -I` into a terminal window
- On Mac OS, go to System Preferences then Network and select your active network connection to view the IP address or type `ifconfig`. en0 -> inet should be your IP address.
- On Windows, go to the Control Panel, then under Network and Sharing Center, click View network connections, select your active network connection and click View status of this connection to view the IP address
Now you have the IP address of your computer, you will scan the whole subnet for other devices. For example, if your IP address is `192.168.1.5`, other devices will be at addresses like `192.168.1.2`, `192.168.1.3`, `192.168.1.4`, etc. The notation of this subnet range is `192.168.1.0/24` (this covers `192.168.1.0` to `192.168.1.255`).

Now use the `nmap` command with the -sn flag (ping scan) on the whole subnet range. This may take a few seconds:

`nmap -sn 192.168.1.0/24`
Ping scan just pings all the IP addresses to see if they respond. For each device that responds to the ping, the output shows the hostname and IP address like so:

```console
    Starting Nmap 6.40 ( http://nmap.org ) at 2014-03-10 12:46 GMT
    Nmap scan report for hpprinter (192.168.1.2)
    Host is up (0.00044s latency).
    Nmap scan report for Gordons-MBP (192.168.1.4)
    Host is up (0.0010s latency).
    Nmap scan report for ubuntu (192.168.1.5)
    Host is up (0.0010s latency).
    Nmap scan report for raspberrypi (192.168.1.8)
    Host is up (0.0030s latency).
    Nmap done: 256 IP addresses (4 hosts up) scanned in 2.41 seconds
    Here you can see a device with hostname raspberrypi has IP address 192.168.1.8.
```

## SSH Connection
<img align="right" src="https://www.dropbox.com/s/arhpkyheazk4kao/ssh_pi_pass.jpg?dl=1" alt="console" height="150px">

Now when you have raspbian installed and you know the correct IP address of your PI we can start development.

    First of all open a comand line on your PC or laptop.
enter: `ssh pi@<ip-address>` paste rpi's ip instead of `<ip-address>`
You should see the next picture. Default password is `raspberry`. Press enter.
Now you have remote access to raspberry.

## Cloning Repository
1. Navigate to appropriate directory on your raspbian system. As example `cd Desktop`.
2. Clone this repo `git clone https://github.com/yaroslav0507/PWO_Hardware.git`.
3. Enter project directory `cd PWO_Hardware`.

## Setup Dependencies
We need to build `bcm2835` driver to use DHT sensor.
`bcm2835` is the Broadcom chip used in the Raspberry Pi 2 Model B
 
The underlying architecture in BCM2836 is identical to BCM2835. 
The only significant difference is the removal of the ARM1176JZF-S processor and replacement with a quad-core Cortex-A7 cluster.

Execute next commands in console to get and build driver

1. wget http://www.open.com.au/mikem/bcm2835/bcm2835-1.49.tar.gz
2. tar xvfz bcm2835-1.49.tar.gz; 
3. cd bcm2835-1.49;
4. ./configure; 
5. make; 
6. sudo make install

Now when driver is installed, we can install Node dependencies. Get back to the project directory `cd ..`.
Type `npm install`;
Node Package Manager should install next dependencies automatically
- johnny-five - robotics framework
- node-dht-sensor - humidity and temperature sensor middleware
- express - simple node.js server
- socket-io - WebSockets middleware for instant data transfer to the web client
- dotenv - middleware that allows you to provide environment variables, such as server port or critical humidity value

Congrats. You've install all required dependencies and can process to next step.

## Wiring up
Now we can wire up all devices and mount them on raspberry.

#### Servo
<img align="right" src="https://www.dropbox.com/s/n415mipeddr8gcq/PWO_Hardware_Servo.jpg?dl=1" alt="JavaScript Robotics" height="290px">

In my case I used `Turnigy™ TGY-390DMH High Performance DS/MG Servo` 5.4kg / 0.11sec / 22.5g

Specification: 
- Weight: 22.5 grams / 0.79 oz. 
- Dimensions: 29 x 13 x 30 mm / 1.14 x 0.51 x 1.18 inch 
- Torque @ 4.8V: 4.6 kg/cm , 64 oz/in 
- Torque @ 6.0V: 5.4 kg/cm , 75 oz/in 
- Speed @ 4.8V: 0.14sec / 60 deg at no load 
- Speed @ 6.0V: 0.11sec / 60 deg at no load

1. Connect the pilot wire (it is always orange or yellow) to the 12th pin of GPIO.
2. Connect red (power) wire to the second pin of GPIO (5v.)
3. Connect brown wire (ground) to the 0v.

#### DHT (Digital Humidity and Temperature sensor)
<img align="right" src="https://www.dropbox.com/s/x6dkpgb6qj2r3in/PWO_Hardware_DHT.jpg?dl=1" alt="DHT" width="290px">

I used 3 pin AM2302 sensor. You can use DHT22, the are almost same. Here are technical characteristics.
- Model DHT22
- Power supply 3.3-6V DC
- Output signal digital signal via single-bus
- Sensing element Polymer capacitor
- Operating range humidity 0-100%RH; temperature -40~80Celsius
- Accuracy humidity +-2%RH(Max +-5%RH); temperature <+-0.5Celsius
- Resolution or sensitivity humidity 0.1%RH; temperature 0.1Celsius
- Repeatability humidity +-1%RH; temperature +-0.2Celsius
- Humidity hysteresis +-0.3%RH
- Long-term Stability +-0.5%RH/year
- Sensing period Average: 2s
- Interchangeability fully interchangeable
- Dimensions small size 14*18*5.5mm; big size 22*28*5mm

1. Connect ground wire (Brown) to the 0v. pin 25th for example.
2. Connect power wire (red) to the 17th pin of GPIO.
3. Connect the pilot wire (orange) to the 7th pin of GPIO.

Now we can start application. Enter the project dirrectory `cd PWO_Hardware` execute `sudo node index.js`.
App should start on raspberry. Now DHT sensor will react on humidity changes. When humidity reaches critical level servo is starting to work. You can connect it to any watering system and make it open and close after humidity reaches normal level again.

#### GPIO Pins 
<img src="https://www.dropbox.com/s/thwe1ri7hkgb91l/Screen%20Shot%202016-05-20%20at%202.33.11%20PM.png?dl=1" alt="DHT">



