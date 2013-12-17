
describe('Operator == and type coercion', function(){
	it('Operator == acts oddly due to type coercion', function(){
		expect('     ' == 0).toBe(__);
		expect('  \t \r \n' == 0).toBe(__);
		expect('' == 0).toBe(__);		
		expect(0 == '0').toBe(__);		
		expect('' == '0').toBe(__);
		expect(false == '0').toBe(__);
		expect(null == undefined).toBe(__);		
		expect(false == 'false').toBe(__);		
		expect(false == null).toBe(__);		
		expect(false == undefined).toBe(__);		
	})
});



describe('Invocation patterns', function (){
	var storedThis, aFunction, samurai;
	beforeEach(function () {
		storedThis = undefined;
		aFunction = function () {
			storedThis = this;
		};
		samurai = {
			aMethod: aFunction
		};
	});
	
	describe('method', function () {
		it('1 - should understand method invocation pattern', function () {
			samurai.aMethod();
			expect(storedThis).toBe(samurai);
		});
		it('2 - should understand method invocation pattern', function () {
			var samurai2 = {
				aMethod: samurai.aMethod
			};
			samurai2.aMethod();
			expect(storedThis).toBe(samurai2);
		});
		it('3 - should understand method invocation pattern', function () {
			var samurai2 = {
				samurai: samurai,
				aMethod: samurai.aMethod
			};
			samurai2.samurai.aMethod();
			expect(storedThis).toBe(samurai);
			samurai2.aMethod();
			expect(storedThis).toBe(samurai2);
		});
	});

	describe('function', function () {
		it('4 - should understand function invocation pattern', function () {
			aFunction();
			expect(storedThis).toBe(window);
		});
		it('5 - should understand function invocation pattern', function () {
			//try and decipher this for bonus points
			var result = (function () {
				return this;
			}());
			expect(result).toBe(window);
		});
		it('6 - should understand function invocation pattern', function () {
			var myMethod = samurai.aMethod;
			aFunction();
			expect(storedThis).toBe(window);
			samurai.aMethod();
			expect(storedThis).toBe(samurai);
			myMethod();
			expect(storedThis).toBe(window);
		});
		it('7 - should understand strict mode', function () {
			var storedThis, strictMethod = function () {
				'use strict';
				storedThis = this;
			};
			strictMethod();
			expect(storedThis).toBe(undefined);
		});
	});

	describe('constructor', function () {
		it('8 - should understand constructor invocation pattern', function () {
			var Constructor1 = aFunction;
			var Constructor2 = samurai.aMethod;
			var s1;
			var s2; 
			var s3; 
			var s4;
			s1 = new Constructor1();
			expect(storedThis).toBe(s1);
			s2 = new Constructor2();
			expect(storedThis).toBe(s2);
			s3 = new aFunction();
			expect(storedThis).toBe(s3);
			s4 = new samurai.aMethod();
			expect(storedThis).toBe(s4);
		});
		it('9 - should understand constructor invocation pattern', function () {
			var Samurai = function (name) {
				this.getName = function () {
					return name;
				};
				this.setName = function (value) {
					name = value;
				};
			}, name = 'Myamoto', samurai = new Samurai(name);
			expect(name).toBe('Myamoto');
			expect(samurai.name).toBe(undefined);
			expect(samurai.getName()).toBe('Myamoto');
			samurai.setName('Hattori');
			expect(name).toBe('Myamoto');
			expect(samurai.getName()).toBe('Hattori');
			samurai.name = 'Myamoto';
			expect(samurai.name).toBe('Myamoto');
			expect(samurai.getName()).toBe('Hattori');
		});
		it('10 - should understand instanceof', function () {
			var Samurai = function (name) {
				this.getName = function () {
					return name;
				};
				this.setName = function (value) {
					name = value;
				};
			}, samurai = new Samurai('Myamoto');
			expect(samurai instanceof Samurai).toBe(true);
			expect(samurai instanceof Object).toBe(true);
			expect(samurai instanceof Array).toBe(false);
			expect(samurai.constructor).toBe(Samurai);
		});
	});

	describe('call/apply', function () {
		it('11 - should understand call-apply invocation pattern', function () {
			var samurai2 = {
				aMethod: aFunction
			}, samurai3 = {};
			samurai.aMethod.call(samurai2);
			expect(storedThis).toBe(samurai2);
			samurai.aMethod.apply(samurai3, []);
			expect(storedThis).toBe(samurai3);
		});
	});

});
