/*
# Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# 
# Licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License.
# A copy of the License is located at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# or in the "license" file accompanying this file. This file is distributed 
# on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either 
# express or implied. See the License for the specific language governing 
# permissions and limitations under the License.
#
*/

const logger = require("/opt/nodejs/lib/logging").getLogger("config");
const Utils = require("/opt/nodejs/lib/utils");

module.exports = class Config {
    constructor(event, amb) {
        const fcnName = "[Config.constructor]";

        let parsedEvent = event;

        return new Promise(async (resolve, reject) => {
            try {

                // Checking if event originated in SNS and triggered by CloudWatch alarm
                if (event.Records) {
                    // Assuming we are expecting to receive one event at a time
                    const alarmEvent = JSON.parse(event.Records[0].Sns.Message);

                    if (alarmEvent.NewStateValue !== "ALARM") {
                        throw new Error(` Please make sure the event generated by CloudWatch is in ALARM state`)
                    }

                    await Utils.__arrayIterator(alarmEvent.Trigger.Dimensions, (dimension) => {
                        switch (dimension.name) {
                            case "NetworkId":
                                parsedEvent.networkId = dimension.value;
                                break;
                            case "MemberId":
                                parsedEvent.memberId = dimension.value;
                                break;
                            case "NodeId":
                                parsedEvent.peerId = dimension.value;
                                break;
                            case "NodeAvailabilityZone":
                                parsedEvent.availabilityZone = dimension.value;
                                break;
                            case "NodeInstanceType":
                                parsedEvent.instanceType = dimension.value;
                                break;
                            case "AccountOwnsMember":
                                parsedEvent.accountOwnsMember = JSON.parse(dimension.value);
                                break;
                            default:
                                break;
                        }
                    })
                    resolve(this);
                }

                this.networkId = parsedEvent.networkId
                if (!this.networkId || !this.networkId instanceof String || !this.networkId.length) {
                    throw new Error(` Please specify networkId in the event message`)
                };

                this.memberId = parsedEvent.memberId
                if (!this.memberId || !this.memberId instanceof String || !this.memberId.length) {
                    throw new Error(` Please specify memberId in the event message`)
                };

                this.peerId = parsedEvent.peerId
                if (!this.peerId || !this.peerId instanceof String || !this.peerId.length) {
                    throw new Error(` Please specify peerId in the event message`)
                };

                this.availabilityZone = parsedEvent.availabilityZone
                if (!this.availabilityZone || !this.availabilityZone instanceof String || !this.availabilityZone.length) {
                    throw new Error(` Please specify availabilityZone in the event message`)
                };

                this.instanceType = parsedEvent.instanceType
                if (!this.instanceType || !this.instanceType instanceof String || !this.instanceType.length) {
                    throw new Error(` Please specify instanceType in the event message`)
                };

                this.accountOwnsMember = parsedEvent.accountOwnsMember
                if (typeof this.accountOwnsMember !== "boolean") {
                    throw new Error(` Please specify accountOwnsMember as type Boolean in the event message`)
                };

                if (parsedEvent.channelsNames) {
                    this.channelsNames = parsedEvent.channelsNames
                }

                if (parsedEvent.chaincodesNames) {
                    this.chaincodesNames = parsedEvent.chaincodesNames
                }

                this.deleteAMBNodeFcnName = process.env.AMB_APPS_DELETE_AMB_NODE_FCN_NAME
                if (!this.deleteAMBNodeFcnName || !this.deleteAMBNodeFcnName instanceof String || !this.deleteAMBNodeFcnName.length) {
                    throw new Error(` Please set AMB_APPS_DELETE_AMB_NODE_FCN_NAME with correct lambda function name`)
                };

                this.createAMBNodeFcnName = process.env.AMB_APPS_CREATE_AMB_NODE_FCN_NAME
                if (!this.createAMBNodeFcnName || !this.createAMBNodeFcnName instanceof String || !this.createAMBNodeFcnName.length) {
                    throw new Error(` Please set AMB_APPS_CREATE_AMB_NODE_FCN_NAME with correct lambda function name`)
                };

                this.joinChannelsFcnName = process.env.AMB_APPS_JOIN_CHANNELS_FCN_NAME
                if (!this.joinChannelsFcnName || !this.joinChannelsFcnName instanceof String || !this.joinChannelsFcnName.length) {
                    throw new Error(` Please set AMB_APPS_JOIN_CHANNELS_FCN_NAME with correct lambda function name`)
                };

                this.installChaincodeFcnName = process.env.AMB_APPS_INSTALL_CHAINCODE_FCN_NAME
                if (!this.installChaincodeFcnName || !this.installChaincodeFcnName instanceof String || !this.installChaincodeFcnName.length) {
                    throw new Error(` Please set AMB_APPS_INSTALL_CHAINCODE_FCN_NAME with correct lambda function name`)
                };

                resolve(this);

            } catch (err) {
                reject(`${fcnName}: ${err}`);
                throw Error(`${fcnName}: ${err}`);
            }
        })
    }

    setChannelsNames(channelsNamesArray) {
        const fcnName = "[Config.setChannelsNamesArray]";

        return new Promise(async (resolve, reject) => {
            this.channelsNames = channelsNamesArray ? channelsNamesArray : [];
            resolve(this);
        });
    }

    setChaincodesNames(chaincodesNamesArray) {
        const fcnName = "[Config.setChaincodesNamesArray]";

        return new Promise(async (resolve, reject) => {
            this.chaincodesNames = chaincodesNamesArray ? chaincodesNamesArray : [];
            resolve(this);
        });
    }

    setNewPeerId(peerId) {
        const fcnName = "[Config.setNewPeerId]";

        return new Promise(async (resolve, reject) => {
            this.newPeerId = peerId;
            resolve(this);
        });
    }
}