export const TreeCardStateMachine = {
    'renderState': {
        'canAdd': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'init'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '新增',
            'description': ''
        },
        'canEdit': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'init'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '编辑',
            'description': ''
        },
        'canCancel': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'add'",
                'relation': 'or',
                'rBracket': ''
            }, {
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'edit'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '取消',
            'description': ''
        },
        'canSave': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'add'",
                'relation': 'or',
                'rBracket': ''
            }, {
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'edit'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '保存',
            'description': ''
        },
        'canRemove': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'init'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '删除',
            'description': ''
        },
        'editable': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'add'",
                'relation': 'or',
                'rBracket': ''
            }, {
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'edit'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '可编辑',
            'description': ''
        },
        'canAddDetail': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'add'",
                'relation': 'or',
                'rBracket': ''
            }, {
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'edit'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '新增明细',
            'description': ''
        },
        'canRemoveDetail': {
            'condition': [{
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'add'",
                'relation': 'or',
                'rBracket': ''
            }, {
                'lBracket': '',
                'source': 'state',
                'compare': '===',
                'target': "'edit'",
                'relation': '',
                'rBracket': ''
            }],
            'name': '删除明细',
            'description': ''
        }
    },
    'state': [{
        'state': 'add',
        'name': '新增',
        'description': '处于新增状态'
    }, {
        'state': 'init',
        'name': '初始',
        'description': '处于初始状态'
    }, {
        'state': 'edit',
        'name': '编辑',
        'description': '处于编辑状态'
    }],
    'initialState': 'init',
    'action': {
        'Create': {
            'name': '创建',
            'transitTo': 'add',
            'description': '新建并切换至新增状态'
        },
        'Edit': {
            'name': '编辑',
            'transitTo': 'edit',
            'description': '编辑并切换至编辑状态'
        },
        'Cancel': {
            'name': '取消',
            'transitTo': 'init',
            'description': '取消并切换至初始状态'
        },
        'Save': {
            'name': '保存',
            'transitTo': 'init',
            'description': '保存并切换至初始状态'
        }
    }
};
