/* deploy the List contract and interactions   */

const { deploy_from_file, sc_call } = require("./blockchain.js");

async function run_remove()
{
  async function remove(val)
  {
    const args = [ { vname: 'value', type: 'Uint32',  value: val.toString() },];
    tx = await sc_call(sc, "remove_if_equal_to", args);
    const l = await sc.getSubState('list');
    console.log(`list in state after call to remove ${val}:`, l);
  }

  let tx = sc = null;
  try { // deploy the contract
    const init = [ { vname: '_scilla_version', type: 'Uint32', value: '0',}, ];
    [tx, sc] = await deploy_from_file("../contracts/List.scilla", init);
    console.log("contract deployed @ ", sc.address);
    try { // call create123(.) and log state
      tx = await sc_call(sc, "create123");
      const state = await sc.getState();
      console.log(`state after call to create123():`, state);
      try { // remove element with value 2, (non existing) value 0, value 1, value 3
        await remove(2);
        await remove(0);
        await remove(1);
        await remove(3);
      } catch (err) {
        console.log("remove_if_equal_to(.): ERROR\n",err);
      }
    } catch (err) {
      console.log("create123(): ERROR\n",err);
    }
  } catch (err) {
    console.log("deploy_from_file(.): ERROR\n",err);
  }
}

run_remove();
