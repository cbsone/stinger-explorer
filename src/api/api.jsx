import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';           // development only
// import dateFormat from 'dateformat';
// import JSSalsa20 from "js-salsa20";
export const addr = 'https://explorer.cbs.io/api';
export const backAddr = 'https://explorer.cbs.io/backend';

export const rpc = new JsonRpc(addr, { fetch });

export const CreateApi = (privKeys = []) => new Api({
    rpc,
    signatureProvider: new JsSignatureProvider(privKeys),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
    chainId: "be342a515ce471ac8d4f0f074011a187ec2d310d63fba9b42102eaf597c55b3b",
});

export const memfmt = (value) => {
    value = parseInt(value);
    if (value < (1 << 10)) {
        return `${value ? value : '0'} B`;
    } else if (value < (1 << 20)) {
        return `${Math.round((value * 100) / (1 << 10)) / 100} KiB`;
    } else if (value < (1 << 30)) {
        return `${Math.round((value * 100) / (1 << 20)) / 100} MiB`;
    } else if (value < (1024 * 1024 *1024 * 1024)) {
        return `${Math.round((value * 100) / (1 << 30)) / 100} GiB`;
    }

    return `${Math.round((value * 100) / (1024 * 1024 *1024 * 1024)) / 100} TiB`;
}

export const percent = (value, max) => Math.round((parseInt(value) / parseInt(max)) * 100) / 100;

export const cbsfmt = (value) => value ? value / 10000 : '0';

export const cpuTime = (value) => {
    // console.log(`cpu time ${value}`)
    if (value < 1000) {
        return `${value} us`;
    } else if (value < 1000000) {
        return `${Math.round(value / 1000)} ms`
    }

    value = value / 1000000;
    if (value < 60) {
        return `${Math.round(value)} s`
    } else if (value < 3600) {
        return `${Math.round(value / 60)} min`
    }

    return `${Math.round(value / 3600)} hr`
}

export const get_accounts = async (pubkey) => {
    const response = await fetch(`${addr}/v1/history/get_key_accounts`, {
        method: 'POST',
        body: JSON.stringify({public_key: pubkey})
    })

    if (response.ok) {
        return await response.json();
    }
}

export const shortKey = (key) => `${key}`.substr(0, 10) + '...' + `${key}`.substr(0, -6);

export const getNodes = async (page) => {
    let result = [];
    let rows = await rpc.get_table_rows({code: 'eosio', scope: 'eosio', table: 'producers'});
    for (let row of rows.rows) {
        let item = {
            active: row.is_active,
            lastClaim: row.last_claim_time,
            name: row.owner,
            key: row.producer_key,
            votes: row.total_votes,
            staked: 0,
            slots: 0,
            minValue: 0,
            fees: 0
        }

        let p4 = await rpc.get_table_rows({
            code: 'eosio',
            scope: 'eosio',
            table: 'producers4',
            lower_bound: row.owner,
            limit: 1,
        })

        if (p4 && p4.rows && p4.rows.length) {
            const row2 = p4.rows[0];
            item.fees = row2.fees;
            item.slots = row2.slots.length;
            item.minValue = row2.slots.reduce((result, current) => result.value > current.value ? current : result).value;
            item.staked = row2.total_stake;
        }

        result.push(item)
    }

    return result;
}

export const getTopHolders = async (offset = 0, count =30) => {
    const endpoint = `${backAddr}/top/holders/${offset}/${count}`;
    const resp = await fetch(endpoint);

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error);
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend')
}

export const getTopStake = async (offset = 0, count =30) => {
    const endpoint = `${backAddr}/top/stake/${offset}/${count}`;
    const resp = await fetch(endpoint);

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error);
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend')
}

export const getTopUnstake = async (offset = 0, count =30) => {
    const endpoint = `${backAddr}/top/unstake/${offset}/${count}`;
    const resp = await fetch(endpoint);

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error);
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend')
}

export const getTopProducers = async (offset = 0, count =30) => {
    const endpoint = `${backAddr}/top/producers/${offset}/${count}`;
    const resp = await fetch(endpoint);

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error);
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend')
}

export const getTopRAM = async (offset = 0, count =30) => {
    const endpoint = `${backAddr}/top/ram/${offset}/${count}`;
    const resp = await fetch(endpoint);

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error);
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend')
}

export const getStakedCBS = async () => {
    const endpoint = `${backAddr}/stats/staked`;
    const resp = await fetch(endpoint);

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error)
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend');
}

export const getCBSStats = async () => {
    const staked = await getStakedCBS();

    const cs = await rpc.get_currency_stats('eosio.token', 'CBS')
    const supply = parseFloat(cs.CBS.supply.replace(' CBS', '')) * 10000;

    return parseFloat(staked / supply) * 100;
}

export const getRAMStats = async () => {
    const data = await rpc.get_table_rows({code: 'eosio', scope: 'eosio', table: 'rammarket'});
    if (data && data.rows && data.rows.length) {
        const row = data.rows[0];
        const total = parseFloat(row.supply.replace(' RAMCORE', ''));
        const used = parseFloat(row.base.balance.replace(' RAM', ''));
        return {used, total};
    }

    return {used: 0, total: 0};
}

export const getBlocks = async (noempty = false, offset = 0, count = 100, search = '') => {
    const endpoint = `${backAddr}/blocks/${offset}/${count}`;
    const resp = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({noempty, search}),
    });

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error)
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend');    
}

export const getTransactions = async (offset = 0, count = 30, search = '') => {
    const endpoint = `${backAddr}/txes/${offset}/${count}`;
    search = search.toUpperCase();
    const resp = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({search})
    });

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error)
        }

        let {count, values} = result.result;

        for (let i in values) {
            const tx = await rpc.history_get_transaction(values[i].id);
            values[i].timestamp = tx.block_time;
        }

        return {count, values};
    }

    throw new Error('Cannot connect to backend');    
}

export const getActions = async (offset = 0, count = 30, { account = '', category = '', action = '', contract = '' }) => {
    const endpoint = `${backAddr}/actions/${offset}/${count}`;
    const resp = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({account, category, action, contract})
    });

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error)
        }

        let {count, values} = result.result;

        for (let i in values) {
            values[i].block = await rpc.get_block(values[i].block_num);
        }

        return {count, values};
    }

    throw new Error('Cannot connect to backend');    
}

export const actCategory = (act) => {
    switch(act) {
        case 'transfer':
        case 'issue':
        case 'token':
            return 'Send Tokens';
        case 'newaccount':
        case 'account':
            return 'Account';
        case 'delegatebw':
        case 'undelegatebw':
        case 'buyram':
        case 'sellram':
        case 'ram_cpu_net':
            return 'RAM/CPU/NET';
        default:
            return 'Contract';
    }
}

export const getTransaction = async (id) => {
    const endpoint = `${backAddr}/transaction/${id}`;
    const resp = await fetch(endpoint);

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error)
        }

        return result.result;
    }

    throw new Error('Cannot connect to backend');    
}

export const getAccounts = async (offset = 0, count = 30, search = '') => {
    const endpoint = `${backAddr}/accounts/${offset}/${count}`;
    const resp = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({search}),
    });

    if (resp.ok) {
        const result = await resp.json();
        if (result.error) {
            throw new Error(result.error);
        }

        let {values, count} = result.result;

        for (let i in values) {
            let block = await rpc.get_block(values[i].block_num);
            values[i].block_id = block.id;
        }

        return {count, values};
    }

    throw new Error('Cannot connect to backend')
}

export const token_fmt = (value) => {
    let [_a, _b] = `${value}`.split('.');
    // console.log('_a', _a, '_b', _b, 'value', value);
    _a = _a ? parseInt(_a) : '0';
    _b = _b ? _b : '0000';
    if (_b.length > 4) {
        _b = _b.substring(0, 4);
    } else if (_b.length < 4) {
        _b = _b + '0'.repeat(4 - _b.length);
    }

    return `${_a}.${_b}`;
}

export const getResLoad = async () => {
    let ram_total = 0;
    let ram_used = 0;
    const _global = await rpc.get_table_rows({scope: 'eosio', code: 'eosio', table: 'global'})
    if (_global.rows.length) {
        const _row = _global.rows[0];
        ram_total = _row.total_ram_bytes_reserved;
        ram_used = _row.total_ram_stake;
    }

    const _stats = await rpc.get_currency_stats('eosio.token', 'CBS');
    const cbs_total = parseFloat(_stats.CBS.supply.replace(' CBS', ''));
    const cbsb = await rpc.get_currency_balance('eosio.token', 'cbs', 'CBS');
    const cbs_staked = cbs_total - parseFloat(cbsb[0].replace(' CBS', ''));

    return {ram_used, ram_total, cbs_staked, cbs_total}
}


export const getStaked = async (search = '') => {
    let prods = await rpc.get_table_rows({code: 'eosio', scope: 'eosio', table: 'producers', limit: 1000});
    prods.rows = prods.rows.filter(v => v.is_active > 0).sort((a, b) => parseFloat(a.total_votes) < parseFloat(b.total_votes) ? 1 : -1).map((v, i) => {
        v.rank = i+1;
        return v;
    });

    let total_votes = prods.rows.reduce((prev, row) => prev + parseFloat(row.total_votes), 0);

    // console.log(prods.rows)
    let result = {};

    if (search && search !== '') {
        prods.rows = prods.rows.filter(v => v.owner.includes(search));
    }

    let prodinfo = {};
    for (let prod of prods.rows) {
        if (!prod.is_active) continue;

        prodinfo[prod.owner] = prod;
        result[prod.owner] = {
            name: prod.owner,
            rank: prod.rank,
            status: prod.rank <= 21 ? 'Top 21' : 'Node',
            total_votes: parseFloat(prod.total_votes),
            commission: `0%`,
            totalStake: 0,
            stake: 0 ,
            totalStakeDetails: '0',
            slot: 0,
            slotDetails: `0`,
            reward: `0`,
        }
    }

    // console.log(prodinfo)

    const prod_f = prods.rows.map(v => v.owner);
    let stakes = await rpc.get_table_rows({code: 'eosio', scope: 'eosio', table: 'prodextra', limit: 1000});
    stakes = stakes.rows.filter(v => prod_f.includes(v.owner)).sort((a, b) => a.total_stake < b.total_stake ? 1 : -1).map((v, i) => {
        v.rank = i+1;
        return v;
    });

    for (let v of stakes) {
        let today_staked = 0;
        let stake = 0;
        let total_stake = 0;

        result[v.owner] = {
            name: v.owner,
            rank: v.rank,
            status: 'Node',
            commission: `${parseFloat(v.fees) * 100}%`,
            totalStake: `${v.total_stake / 10000} CBS`,
            totalStakeRaw: v.total_stake,
            stake: `${parseInt(stake * 100) / 100}%`,
            totalStakeDetails: `${today_staked} CBS`,
            reward: 0,
            stakeValue: `${total_stake / 10000}`,
            slotCount: 1000-v.slots.length,
            totalStakeVal: total_stake,
            comissionRaw: parseFloat(v.fees),
            votes: total_votes === 0 ? '0' : prodinfo[v.owner].total_votes / total_votes,
            totalVotes: parseFloat(prodinfo[v.owner].total_votes),
            votesToday: '0',
        }
    }

    return Object.values(result).sort((a, b) => a.totalStakeRaw < b.totalStakeRaw ? 1 : -1).map((v, i) => { 
        v.rank = i+1; 
        v.status = v.rank <= 21 ? 'Top 21' : 'Node';
        v.reward = v.rank <= 21 ? 7 : 8;
        v.reward -= v.reward * v.comissionRaw;
        v.revards = `${Math.round(v.reward / 30 * 10000) / 10000} CBSCH`
        return v
    });
}