const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
chai.use(sinonChai)

const assert = chai.assert
const DeepCloner = require("../src/index")
describe("new DeepCloner().clone", () => {
  it("是一个类",()=>{
    assert.isFunction(DeepCloner)
  })
  describe("能够复制基本类型", ()=>{
    it("能复制数字",()=>{
      const n = 123
      const _n = new DeepCloner().clone(n)
      assert(n === _n)
      const n2 = NaN
      const _n2 = new DeepCloner().clone(n2)
      assert.isNaN(_n2)
    })

    it("能复制字符串",()=>{
      const s = 'string'
      const _s = new DeepCloner().clone(s)
      assert(s === _s)
    })

    it("能复制布尔值",()=>{
      const b = true
      const _b = new DeepCloner().clone(b)
      assert(b === _b)
    })

    it("能复制 undefined",()=>{
      const u = undefined
      const _u = new DeepCloner().clone(u)
      assert(u === _u)
    })

    it("能复制 null", ()=>{
      const empty = null
      const _empty = new DeepCloner().clone(empty)
      assert(empty === _empty)
    })

    it("能复制 symbol",()=>{
      const sym = Symbol()
      const _sym = new DeepCloner().clone(sym)
      assert(sym === _sym)
    })
    
    it("能复制 bigint", ()=> {
      const bigint = BigInt(10n)
      const _bigint = new DeepCloner().clone(bigint)
      assert(bigint === _bigint)
    })

    describe("能复制对象",()=>{
      it("能够复制普通对象",()=>{
        const a = {name:'皮卡丘',child:{name:'皮卡乒'}}
        const _a = new DeepCloner().clone(a)
        assert(a !== _a)
        assert(a.name === _a.name)
        assert(a.child !== _a.child)
        assert(a.child.name === _a.child.name)
      })
      it("自动跳过原型属性",()=>{
        const a = Object.create({name:'a'})
        a.xxx = {yyy:{zzz:1}}
        const _a = new DeepCloner().clone(a)
        assert(a !== _a)
        assert.isFalse("name" in _a)
        assert(a.xxx.yyy.zzz === _a.xxx.yyy.zzz);
        assert(a.xxx.yyy !== _a.xxx.yyy);
        assert(a.xxx !== _a.xxx);
      })
      xit("不会爆栈", () => {
        const a = { child: null };
        let b = a;
        for (let i = 0; i < 10000; i++) {
          b.child = {
            child: null
          };
          b = b.child;
        }
        const a2 = new DeepCloner().clone(a);
        assert(a !== a2);
        assert(a.child !== a2.child);
      });
      it("能够复制带环引用的对象",()=>{
        const a = {name:'皮卡丘'}
        a.self = a
        const _a = new DeepCloner().clone(a)
        assert(a !== _a)
        assert(a.name === _a.name)
        assert(a.self !== _a.self)
      })
      it("能够复制数组对象",()=>{
        const a = [[11,12],[21,22],[31,32]]
        const _a = new DeepCloner().clone(a)
        assert(a !== _a)
        assert(a[0] !== _a[0])
        assert(a[1] !== _a[1])
        assert(a[2] !== _a[2])
        assert.deepEqual(a, _a)
      })
      it("能够复制函数",()=>{
        const a = function(x,y){
          return x+y
        }
        a.xxx = {yyy:{zzz:1}}
        const _a = new DeepCloner().clone(a)
        assert(a !== _a)
        assert(a.xxx !== _a.xxx)
        assert(a.xxx.yyy !== _a.xxx.yyy)
        assert(a.xxx.yyy.zzz === _a.xxx.yyy.zzz)
        assert(a(1,2) === _a(1,2))
      })
      it("能够复制箭头函数",()=>{
        const a = (x,y)=>{
          return x+y
        }
        a.xxx = {yyy:{zzz:1}}
        const _a = new DeepCloner().clone(a)
        assert(a !== _a)
        assert(a.xxx !== _a.xxx)
        assert(a.xxx.yyy !== _a.xxx.yyy)
        assert(a.xxx.yyy.zzz === _a.xxx.yyy.zzz)
        assert(a(1,2) === _a(1,2))
      })
      it("可以复制正则表达式",() => {
        const a = new RegExp("hi\\d+","gi")
        a.xxx = {yyy:{zzz:1}}
        const _a = new DeepCloner().clone(a)
        assert(a.source === _a.source)
        assert(a.flags === _a.flags)
        assert(a !== _a)
        assert(a.xxx !== _a.xxx)
        assert(a.xxx.yyy !== _a.xxx.yyy)
        assert(a.xxx.yyy.zzz === _a.xxx.yyy.zzz)
      })
      it("很复杂的对象", () => {
        const a = {
          n: NaN,
          n2: Infinity,
          s: "",
          bool: false,
          null: null,
          u: undefined,
          sym: Symbol(),
          o: {
            n: NaN,
            n2: Infinity,
            s: "",
            bool: false,
            null: null,
            u: undefined,
            sym: Symbol()
          },
          array: [
            {
              n: NaN,
              n2: Infinity,
              s: "",
              bool: false,
              null: null,
              u: undefined,
              sym: Symbol()
            }
          ]
        };
        const a2 = new DeepCloner().clone(a);
        assert(a !== a2);
        assert.isNaN(a2.n);
        assert(a.n2 === a2.n2);
        assert(a.s === a2.s);
        assert(a.bool === a2.bool);
        assert(a.null === a2.null);
        assert(a.u === a2.u);
        assert(a.sym === a2.sym);
        assert(a.o !== a2.o);
        assert.isNaN(a2.o.n);
        assert(a.o.n2 === a2.o.n2);
        assert(a.o.s === a2.o.s);
        assert(a.o.bool === a2.o.bool);
        assert(a.o.null === a2.o.null);
        assert(a.o.u === a2.o.u);
        assert(a.o.sym === a2.o.sym);
        assert(a.array !== a2.array);
        assert(a.array[0] !== a2.array[0]);
        assert.isNaN(a2.array[0].n);
        assert(a.array[0].n2 === a2.array[0].n2);
        assert(a.array[0].s === a2.array[0].s);
        assert(a.array[0].bool === a2.array[0].bool);
        assert(a.array[0].null === a2.array[0].null);
        assert(a.array[0].u === a2.array[0].u);
        assert(a.array[0].sym === a2.array[0].sym);
      });
    })
  })
})