// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Hospital {
    struct Report {
        string name;
        string doctor;
        string report;
        string date_of_report;
    }
    struct Patient {
        string name;
        uint age;
        string user;
        address[] doctorAccessList;
    }
    struct doctor {
        string name;
        uint age;
        string user;
        address[] patientAccessList;
    }

    struct UserExist {
        string user;
        bool exist;
    }
    address[] public patientList;
    address[] public doctorList;

    mapping(address => Patient) private patientInfo;
    mapping(address => doctor) private doctorInfo;
    mapping(address => mapping(address => Report)) reportData;

    function patientExist(address _id) public view returns (UserExist memory) {
        UserExist memory user;
        for (uint i = 0; i < patientList.length; i++) {
            if (patientList[i] == _id) {
                user.exist = true;
                user.user = "patient";
                return user;
            }
        }
        user.exist = false;
        user.user = "patient";
        return user;
    }

    function doctorExist(address _id) public view returns (UserExist memory) {
        UserExist memory user;
        for (uint i = 0; i < doctorList.length; i++) {
            if (doctorList[i] == _id) {
                user.exist = true;
                user.user = "doctor";
                return user;
            }
        }
        user.exist = false;
        user.user = "doctor";
        return user;
    }

    function getALlDoctorList() public view returns (address[] memory) {
        return doctorList;
    }

    function registerPatient(string memory _name, uint age) public {
        require(
            patientExist(msg.sender).exist == false &&
                doctorExist(msg.sender).exist == false,
            "User already exist"
        );
        Patient storage patient = patientInfo[msg.sender];
        patient.name = _name;
        patient.age = age;
        patient.user = "patient";
        patientList.push(msg.sender);
    }

    function registerDoctor(string memory _name, uint age) public {
        require(
            doctorExist(msg.sender).exist == false &&
                patientExist(msg.sender).exist == false,
            "User already exist"
        );
        doctor storage doctors = doctorInfo[msg.sender];
        doctors.name = _name;
        doctors.age = age;
        doctors.user = "doctor";
        doctorList.push(msg.sender);
    }

    function getPatientInfo(
        address _id
    )
        public
        view
        returns (string memory, uint, string memory, address[] memory)
    {
        return (
            patientInfo[_id].name,
            patientInfo[_id].age,
            patientInfo[_id].user,
            patientInfo[_id].doctorAccessList
        );
    }

    function getDoctorDetails(
        address _id
    )
        public
        view
        returns (string memory, uint, string memory, address[] memory)
    {
        return (
            doctorInfo[_id].name,
            doctorInfo[_id].age,
            doctorInfo[_id].user,
            doctorInfo[_id].patientAccessList
        );
    }

    function provideAccess(address owner, address _id) public {
        require(
            patientExist(owner).exist == true,
            "Only Patient can get details"
        );
        Patient storage patient = patientInfo[owner];
        doctor storage doctors = doctorInfo[_id];
        doctors.patientAccessList.push(owner);
        patient.doctorAccessList.push(_id);
    }

    function revokeAccess(address owner, address _id) public {
        Patient storage patient = patientInfo[owner];
        doctor storage doctors = doctorInfo[_id];
        uint index;
        for (uint i = 0; i < patient.doctorAccessList.length; i++) {
            if (patient.doctorAccessList[i] == _id) {
                index = i;
                break;
            }
        }
        patient.doctorAccessList[index] = patient.doctorAccessList[
            patient.doctorAccessList.length - 1
        ];
        patient.doctorAccessList.pop();

        uint dindex;
        for (uint i = 0; i < doctors.patientAccessList.length; i++) {
            if (doctors.patientAccessList[i] == owner) {
                dindex = i;
                break;
            }
        }

        doctors.patientAccessList[dindex] = doctors.patientAccessList[
            doctors.patientAccessList.length - 1
        ];
        doctors.patientAccessList.pop();
    }

    function generatingReport(
        address _id,
        address owner,
        string memory name,
        string memory _doctor,
        string memory _report,
        string memory date_of_report
    ) public {
        require(
            doctorExist(owner).exist == true,
            "Only Doctor can get details"
        );
        Report storage report = reportData[owner][_id];
        Report storage preport = reportData[_id][owner];
        report.name = name;
        report.doctor = _doctor;
        report.date_of_report = date_of_report;
        report.report = _report;
        preport.name = report.name;
        preport.date_of_report = report.date_of_report;
        preport.doctor = report.doctor;
        preport.report = report.report;
    }

    function getReport(
        address owner,
        address _id
    )
        public
        view
        returns (string memory, string memory, string memory, string memory)
    {
        return (
            reportData[owner][_id].name,
            reportData[owner][_id].doctor,
            reportData[owner][_id].report,
            reportData[owner][_id].date_of_report
        );
    }
}
