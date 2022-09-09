

export function queueIdToGameZhType(queueId: number) {
    switch (queueId) {
        case 420: return '单双排';
        case 430: return '匹配模式';
        case 440: return '灵活排位';
        case 450: return '极地大乱斗';
    }
    return '其它模式'
}